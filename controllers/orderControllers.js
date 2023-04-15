const asyncHandler = require('express-async-handler');

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const handlers = require("./handlers");
const ApiError = require('../utils/ApiError');

// @desc    Create cash order
// @route   POST /api/v1/order
// @access  Private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // Get Cart
    const cart = await Cart.findById(req.params.cartId);
    if(!cart){
        return next(new ApiError("There is no such cart id", 400));
    }
    // Order price (check if coupon applied)
    const cartPrice = cart.totalPriceAfterDiscount ? 
        cart.totalPriceAfterDiscount : 
        cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // Create order with default payment method (cash)
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.items,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalOrderPrice,
    });
    // Update products' quantity and sold quantity
    if(order){
        const bulkOption = cart.items.map( item => ({
            updateOne: {
                filter: {_id: item.product},
                update: {$inc: {quantity: -item.qty, sold: +item.qty}}
            }
        }));
        await Product.bulkWrite(bulkOption, {});
        // Clear usercart
        await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({
        status: 'Success',
        data: order
    })
});

// @desc    Get logged user orders only 
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if(req.user.role === 'user') req.filterObj = {user: req.user._id};
    next();
})

// @desc    Get all orders
// @route   GET /api/v1/order
// @access  Private/user-admin-manager
exports.getOrders = handlers.getAll(Order);

// @desc    Get specific orders
// @route   GET /api/v1/order/:id
// @access  Private/user-admin-manager
exports.getOrder = handlers.getOne(Order);
