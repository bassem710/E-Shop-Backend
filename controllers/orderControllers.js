require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const handlers = require("./handlers");
const ApiError = require("../utils/ApiError");

// @desc    Update products' quantity and sold quantity
const updateProductQtyAndSold = async (cart, cartId) => {
    const bulkOption = cart.items.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.qty, sold: +item.qty } },
        },
    }));
    await Product.bulkWrite(bulkOption, {});
    // Clear usercart
    await Cart.findByIdAndDelete(cartId);
}

// @desc    Create cash order
// @route   POST /api/v1/order
// @access  Private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // Get Cart
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError("There is no such cart id", 400));
    }
    // Order price (check if coupon applied)
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // Create order with default payment method (cash)
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.items,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalOrderPrice,
    });
    // Update products' quantity and sold quantity
    if (order) {
        updateProductQtyAndSold(cart, req.params.cartId);
    }
    res.status(201).json({
        status: "Success",
        data: order,
    });
});

// @desc    Filter logged user orders only
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
});

// @desc    Get all orders
// @route   GET /api/v1/order
// @access  Private/user-admin-manager
exports.getOrders = handlers.getAll(Order);

// @desc    Get specific orders
// @route   GET /api/v1/order/:id
// @access  Private/user-admin-manager
exports.getOrder = handlers.getOne(Order);

// @desc    Update order paid status
// @route   PUT /api/v1/order/:id/pay
// @access  Private/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("There is no such order id", 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: "success",
        data: updatedOrder,
    });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/order/:id/deliver
// @access  Private/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("There is no such order id", 404));
    }
    order.isDelivered = true;

    const updatedOrder = await order.save();

    res.status(200).json({
        status: "success",
        data: updatedOrder,
    });
});

// @desc    Get checkout session from stripe
// @route   GET /api/v1/order/checkout-session/:cartId
// @access  Private/user
exports.getCheckoutSesion = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    console.log(process.env.STRIPE_SECRET);

    // Get Cart
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError("There is no such cart id", 400));
    }
    // Order price (check if coupon applied)
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name,
                        description: `Cart id : ${req.params.cartId}`,
                    },
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
    });
    // Response
    res.status(200).json({ status: "success", session });
});

const createCardOrder = async session => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const totalOrderPrice = session.amount_total / 100;

    const cart = await Cart.findById(cartId);
    const user = await User.findOne({email: session.customer_details.email});

    // create order 
    const order = await Order.create({
        user: user._id,
        cartItems: cart.items,
        shippingAddress,
        totalOrderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: 'card'
    });

    // Update products' quantity and sold quantity
    if (order) {
        updateProductQtyAndSold(cart, cartId);
    }
}

// @desc    Webhook
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if(event.type === "checkout.session.completed") {
        createCardOrder(event.data.object)
    }

    res.status(200).json({ received: true});
});
