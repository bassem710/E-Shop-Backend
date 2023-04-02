const sharp = require("sharp");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");

const Brand = require('../models/brandModel');
const handlers = require("./handlers");
const { uploadSingleImg } = require('../middlewares/uploadImageMiddleware');

exports.uploadBrandImg = uploadSingleImg("image");
exports.resizeImg = asyncHandler( async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
    next();
});

// @desc    Get list of brands
// @route   GET /api/v1/brand
// @access  Public
exports.getBrands = handlers.getAll(Brand);

// @desc    Get specific brand
// @route   GET /api/v1/brand/:id
// @access  Public
exports.getBrand = handlers.getOne(Brand);

// @desc    Create brand
// @route   POST /api/v1/brand
// @access  Private
exports.addBrand = handlers.createOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brand/:id
// @access  Private
exports.updateBrand = handlers.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brand/:id
// @access  Private
exports.deleteBrand = handlers.deleteOne(Brand);