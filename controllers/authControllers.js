const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// @desc    Sign Up
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler( async (req, res, next) => {
    // Create a new user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    // Genereate token
    const token = generateToken({userId: user._id});
    // Response
    res.status(201).json({data: user, token});
});

// @desc    Log In
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler( async (req, res, next) => {
    // Check email and password in body
    // check if user exists and password is correct
    const user = await User.findOne({ email: req.body.email});
    if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // generate token
    const token = generateToken({userId: user._id});
    // response
    res.status(200).json({data: user, token});
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler( async (req, res, next) => {
    // Check User
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return next(new ApiError(`User ${req.body.email} not found`, 404));
    }
    // Random 6 digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
    // Save hashed reset code in DB
    user.passwordResetCode = hashedResetCode;
    user.passwordResetCodeExp = Date.now() + 10 * 60 * 1000;
    user.passwordResetCodeVerified = false;
    await user.save();
    // Send email
    const msg = `Hi ${user.name},\nwe received a request to reset the password on your E-Commerce Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your accoun secure\n`;
    try{
        await sendEmail({
            email: user.email,
            subject: "Your e-commerce account reset code",
            message: msg,
        });
    } catch(err) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExp = undefined;
        user.passwordResetCodeVerified = undefined;
        await user.save();
        return next(new ApiError("Cannot send reset code email", 500));
    }
    // Response
    res.status(200).json({
        status: "success",
        message: "Reset code sent to email"
    });
});

// @desc    Verify reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler( async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetCodeExp: { $gt: Date.now() },
    });

    if(!user){
        return next(new ApiError("Reset code is invalid or expired", 401));
    }

    user.passwordResetCodeVerified = true;
    await user.save();

    res.status(200).json({
        status: "Success",
        message: "Reset code verified successfully"
    })
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler( async (req, res, next) => {
    // Check user
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ApiError(`User ${req.body.email} does not exist`, 404));
    }
    // Check reset code verified field
    if(!user.passwordResetCodeVerified){
        return next(new ApiError(`Reset code is not verified`, 404));
    }
    // Update user data
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExp = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    // generate token
    const token = generateToken({userId: user._id});
    res.status(200).json({
        status: "Success",
        message: "Password is reseted successfully",
        token: token
    })
});

exports.protect = asyncHandler( async (req, res, next) => {
    // check token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new ApiError("Invalid token, please login again...", 401));
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // check user
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser) return next(new ApiError("User does no longer exist", 401));
    // check if user changed his password after token created
    if(currentUser.passwordChangedAt){
        const passwordChangedAtTimestamp = parseInt(currentUser.passwordChangedAt.getTime()/1000, 10);
        if(passwordChangedAtTimestamp > decoded.iat){
            return next(new ApiError("User recently changed password, please login again...", 401));
        }
    }
    req.user = currentUser;
    next();
});

exports.allowedTo = (...roles) =>
    asyncHandler( async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ApiError("Not allowed to access this route", 403));
        }
        next();
    });