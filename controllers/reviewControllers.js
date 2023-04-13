const Review = require('../models/reviewModel');
const handlers = require("./handlers");

// @desc    Get list of reviews
// @route   GET /api/v1/review
// @access  Public
exports.getReviews = handlers.getAll(Review);

// @desc    Get specific review
// @route   GET /api/v1/review/:id
// @access  Public
exports.getReview = handlers.getOne(Review);

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