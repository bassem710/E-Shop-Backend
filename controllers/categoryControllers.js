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
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if(!category){
        return next(new ApiError(`Category (${id}) is not found`, 404));
    }
    res.status(200).json({data: category});
});

// @desc    Create category
// @route   POST /api/v1/category
// @access  Private
exports.addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({name, slug: slugify(name)});
    res.status(201).json({data: category});
});

// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = handlers.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = handlers.deleteOne(Category);