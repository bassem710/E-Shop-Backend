const sharp = require("sharp");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");

const User = require('../models/userModel');
const handlers = require("./handlers");
const { uploadSingleImg } = require('../middlewares/uploadImageMiddleware');

exports.uploadUserImg = uploadSingleImg("profileImg");
exports.resizeImg = asyncHandler( async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`uploads/users/${filename}`);
        req.body.image = filename;
    }
    next();
});

// @desc    Get list of users
// @route   GET /api/v1/user
// @access  Public
exports.getUsers = handlers.getAll(User);

// @desc    Get specific user
// @route   GET /api/v1/user/:id
// @access  Public
exports.getUser = handlers.getOne(User);

// @desc    Create user
// @route   POST /api/v1/user
// @access  Private
exports.addUser = handlers.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/user/:id
// @access  Private
exports.updateUser = handlers.updateOne(User);

// @desc    Delete specific user
// @route   DELETE /api/v1/user/:id
// @access  Private
exports.deleteUser = handlers.deleteOne(User);