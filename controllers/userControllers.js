const sharp = require("sharp");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const User = require('../models/userModel');
const handlers = require("./handlers");
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
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

// @desc    Get logged user data
// @route   GET /api/v1/user/getMe
// @access  Private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/user/updatePassword
// @access  Private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    const updated = await User.findByIdAndUpdate(req.user._id, 
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        }, {new: true});
        if(!updated){
            return next(new ApiError(`Document with this id is not found`, 404));
        }
        const token = generateToken({userId: updated._id});
        res.status(200).json({data: updated, token});
});

// @desc    Update logged user data (!password, !role)
// @route   PUT /api/v1/user/updateMe
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        {new: true}
        );
    res.status(200).json({data: updatedUser});
}); 

// @desc    Deactivate logged user
// @route   DELETE /api/v1/user/deleteMe
// @access  Private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    const deactivatedUser = await User.findByIdAndUpdate(req.user._id, {active: false}, {new: true});
    if(deactivatedUser.active){
        return next(new ApiError("Could not deactivate your account"));
    }
    res.status(204).json({status: "Success", message: "Account deactivated sucessfully"});
});