const handlers = require('./handlers');

const SubCategory = require('../models/subCategoryModel');

// Nested Route
// GET /api/v1/category/:categoryId/subCategory
exports.createFilterObj = (req, res, next) => {
    let filter = {};
    if(req.params.categoryId) filter = {category: req.params.categoryId};
    req.filter = filter;
    next();
}

// @desc    Get list of subCategories
// @route   GET /api/v1/subCategory
// @access  Public
exports.getSubCategories = handlers.getAll(SubCategory);

// @desc    Get a specific subCategory
// @route   GET /api/v1/subCategory/:id
// @access  Public
exports.getSubCategory = handlers.getOne(SubCategory);

// Nested Route
// GET /api/v1/category/:categoryId/subCategory
exports.setCategoryIdToBody = (req, res, next) => {
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

// @desc    Create subCategory
// @route   POST /api/v1/subCategory
// @access  Private
exports.addSubCategory = handlers.createOne(SubCategory);

// @desc    Update a specific subCategory
// @route   PUT /api/v1/subCategory/:id
// @access  Private
exports.updateSubCategory = handlers.updateOne(SubCategory);

// @desc    Delete a specific subCategory
// @route   DELETE /api/v1/subCategory/:id
// @access  Private
exports.deleteSubCategory = handlers.deleteOne(SubCategory);