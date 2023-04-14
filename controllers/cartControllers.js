const asyncHandler = require('express-async-handler');

const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Product = require('../models/productModel');
const ApiError = require('../utils/ApiError');

// @desc    Calculate cart total price
const calcTotalPrice = cart => {
    let totalPrice = 0;
    cart.items.forEach( item => {
        totalPrice += item.qty * item.price;
    });
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
}

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color, qty} = req.body;
    const product = await Product.findById(productId);
    if(!product){
        return next(new ApiError("Product not found", 400));
    }
    // Get cart for logged user
    let cart = await Cart.findOne({user: req.user._id});
    if(!cart){
        cart = await Cart.create({
            user: req.user._id,
            items: [{product: productId, color, price: product.price, qty: qty || 1}]
        });
    } else {
        // product exists in cart => increment quantity
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId && item.color === color);
        if(productIndex > -1){
            const item = cart.items[productIndex];
            item.qty += qty || 1;
            cart.items[productIndex] = item;
        } else {
            // product does not exist in cart => add to cart
            cart.items.push({product: productId, color, price: product.price, qty: qty || 1});
        }
    }
    // Calculate cart total price
    calcTotalPrice(cart);
    // Save cart edits
    await cart.save();
    // response
    res.status(200).json({
        status: 'success',
        message: "Product added to cart successfully",
        noOfCartItems: cart.items.length,
        data: cart
    })
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({user: req.user._id});
    if(!cart){
        return next(new ApiError("User does not have a cart", 404));
    }
    res.status(200).json({
        status: 'success',
        noOfCartItems: cart.items.length,
        data: cart
    });
});

// @desc    Remove specific product from the cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id},
        {
            $pull: {items: {_id: req.params.itemId}}
        },
        {new: true}
    );
    if(!cart){
        return next(new ApiError("Could not update user cart items", 404));
    }
    calcTotalPrice(cart);
    cart.save();
    res.status(200).json({
        status: 'success',
        noOfCartItems: cart.items.length,
        data: cart
    });
});

// @desc    Clear cart items
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({user: req.user._id});
    res.status(200).json({
        status: 'success',
        message: "Cart is cleared successfully"
    });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateItemQty = asyncHandler(async (req, res, next) => {
    const {qty} = req.body;
    const cart = await Cart.findOne({user: req.user._id});
    if(!cart){
        return next(new ApiError("User does not have a cart", 404));
    }
    const itemIndex = cart.items.findIndex( item => item._id.toString() === req.params.itemId);
    if(itemIndex > -1){
        const item = cart.items[itemIndex];
        item.qty = qty;
        cart.items[itemIndex] = item;
    } else {
        return next(new ApiError("This item does not exist in the cart", 404));
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: "Item quantity updated",
        noOfCartItems: cart.items.length,
        data: cart
    });
});

// @desc    Apply coupon
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const {couponName} = req.body;
    const coupon = await Coupon.findOne({name: couponName, expire: {$gt: Date.now()}});
    if(!coupon){
        return next(new ApiError("Invalid coupon", 400));
    }
    const cart = await Cart.findOne({user: req.user._id});

    const {totalPrice} = cart;

    const totalPriceAfterDiscount = (totalPrice - (totalPrice * (coupon.discount / 100))).toFixed(2);
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: "Item quantity updated",
        noOfCartItems: cart.items.length,
        data: cart
    });
});