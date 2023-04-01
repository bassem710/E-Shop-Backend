const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const handlers = require('./handlers');

const Category = require('../models/categoryModel');

// @desc    Get list of categories
// @route   GET /api/v1/category
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    const docCount = await Category.countDocuments();
    const apiFeatures = new ApiFeatures(Category.find(), req.query)
        .pagination(docCount)
        .filter()
        .search()
        .limitFields()
        .sort()
        .mongooseQueryExec();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;

    res.status(200).json({
        results: categories.length,
        paginationResult,
        data: categories
    })
});

// @desc    Get specific category
// @route   GET /api/v1/category/:id
// @access  Public
exports.getCategory = handlers.getOne(Category);

// @desc    Create category
// @route   POST /api/v1/category
// @access  Private
exports.addCategory = handlers.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = handlers.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = handlers.deleteOne(Category);