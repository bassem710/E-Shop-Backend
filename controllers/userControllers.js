const sharp = require("sharp");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const User = require('../models/userModel');
const handlers = require("./handlers");
const ApiError = require('../utils/ApiError');
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
exports.updateUser = asyncHandler(async (req, res, next) => {
    const updated = await User.findByIdAndUpdate(req.params.id, 
    {
        name: req.body.name,    
        slug: req.body.slug,    
        phone: req.body.phone,    
        email: req.body.email,    
        profileImg: req.body.profileImg,    
        role: req.body.role,   
    }, {new: true});
    if(!updated){
        return next(new ApiError(`Document with this id is not found`, 404));
    }
    res.status(200).json({data: updated});
});

// @desc    Update user password
// @route   PUT /api/v1/user/changePassword/:id
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const updated = await User.findByIdAndUpdate(req.params.id, 
    {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    }, {new: true});
    if(!updated){
        return next(new ApiError(`Document with this id is not found`, 404));
    }
    res.status(200).json({data: updated});
});

// @desc    Delete specific user
// @route   DELETE /api/v1/user/:id
// @access  Private
exports.deleteUser = handlers.deleteOne(User);