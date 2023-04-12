const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');

const generateToken = (payload) =>
    jwt.sign(
        payload, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: process.env.JWT_EXP_IN}
        ); 

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