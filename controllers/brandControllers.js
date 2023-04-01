
const handlers = require('./handlers');

const Brand = require('../models/brandModel');

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