const handlers = require('./handlers');

const Product = require("../models/productModel");

// @desc    Get list of products
// @route   GET /api/v1/product
// @access  Public
exports.getProducts = handlers.getAll(Product, "Product");

// @desc    Get specific product
// @route   GET /api/v1/product/:id
// @access  Public
exports.getProduct = handlers.getOne(Product);

// @desc    Create product
// @route   POST /api/v1/product
// @access  Private
exports.addProduct = handlers.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/product/:id
// @access  Private
exports.updateProduct = handlers.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = handlers.deleteOne(Product);
