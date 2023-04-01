const handlers = require('./handlers');

const Category = require('../models/categoryModel');

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
exports.addCategory = handlers.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = handlers.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = handlers.deleteOne(Category);