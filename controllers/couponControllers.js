const Coupon = require('../models/couponModel');
const handlers = require("./handlers");

// @desc    Get list of coupons
// @route   GET /api/v1/coupon
// @access  Private/admin-manager
exports.getCoupons = handlers.getAll(Coupon);

// @desc    Get specific coupon
// @route   GET /api/v1/coupon/:id
// @access  Private/admin-manager
exports.getCoupon = handlers.getOne(Coupon);

// @desc    Create coupon
// @route   POST /api/v1/coupon
// @access  Private/admin-manager
exports.addCoupon = handlers.createOne(Coupon);

// @desc    Update specific coupon
// @route   PUT /api/v1/coupon/:id
// @access  Private/admin-manager
exports.updateCoupon = handlers.updateOne(Coupon);

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupon/:id
// @access  Private/admin-manager
exports.deleteCoupon = handlers.deleteOne(Coupon);