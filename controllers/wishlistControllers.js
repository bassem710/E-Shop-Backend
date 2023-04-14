const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {wishlist: req.body.productId},
        },
        {new: true}
    );
    res.status(200).json({
        status: "success",
        message: "Product added successfully to your wishlist",
        data: user.wishlist,
    })
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {wishlist: req.params.productId},
        },
        {new: true}
    );
    res.status(200).json({
        status: "success",
        message: "Product removed successfully from your wishlist",
        data: user.wishlist,
    })
});

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate('wishlist')
    res.status(200).json({
        status: "success",
        results: user.wishlist.length,
        data: user.wishlist,
    })
});