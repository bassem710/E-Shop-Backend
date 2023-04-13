const Review = require('../models/reviewModel');
const handlers = require("./handlers");

// Nested Route
// GET /api/v1/product/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filter = {};
    if(req.params.productId) filter = {product: req.params.productId};
    req.filter = filter;
    next();
}

// @desc    Get list of reviews
// @route   GET /api/v1/review
// @access  Public
exports.getReviews = handlers.getAll(Review);

// @desc    Get specific review
// @route   GET /api/v1/review/:id
// @access  Public
exports.getReview = handlers.getOne(Review);

// Nested Route
// POST /api/v1/product/:productId/reviews
exports.setProductAndUserIdToBody = (req, res, next) => {
    if(!req.body.product) req.body.product = req.params.productId;
    if(!req.body.user) req.body.user = req.user._id;
    next();
}

// @desc    Create review
// @route   POST /api/v1/review
// @access  Private (User)
exports.addReview = handlers.createOne(Review);

// @desc    Update specific review
// @route   PUT /api/v1/review/:id
// @access  Private (User)
exports.updateReview = handlers.updateOne(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/review/:id
// @access  Private (User-Admin-Manager)
exports.deleteReview = handlers.deleteOne(Review);