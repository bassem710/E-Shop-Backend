const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add address
// @route   POST /api/v1/address
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {addresses: req.body},
        },
        {new: true}
    );
    res.status(200).json({
        status: "success",
        message: "Address added successfully",
        data: user.addresses
    })
});

// @desc    Remove address
// @route   DELETE /api/v1/address/:addressId
// @access  Private
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {addresses: {_id: req.params.addressId}},
        },
        {new: true}
    );
    res.status(200).json({
        status: "success",
        message: "Address removed successfully",
        data: user.addresses,
    })
});

// @desc    Get user addresses
// @route   GET /api/v1/address
// @access  Private
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate('addresses')
    res.status(200).json({
        status: "success",
        results: user.addresses.length,
        data: user.addresses,
    })
});