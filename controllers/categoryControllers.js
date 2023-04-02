const sharp = require("sharp");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/categoryModel");
const handlers = require("./handlers");
const { uploadSingleImg } = require('../middlewares/uploadImageMiddleware');

exports.uploadCategoryImg = uploadSingleImg("image");
exports.resizeImg = asyncHandler( async (req, res, next) => {
    const ext  = req.file.mimetype.split('/')[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
    next();
});

// @desc    Get list of categories
// @route   GET /api/v1/category
// @access  Public
exports.getCategories = handlers.getAll(Category);

// @desc    Get specific category
// @route   GET /api/v1/category/:id
// @access  Public
exports.getCategory = handlers.getOne(Category);

// @desc    Create category
// @route   POST /api/v1/category
// @access  Private
// Resize image
exports.addCategory = handlers.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = handlers.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = handlers.deleteOne(Category);
