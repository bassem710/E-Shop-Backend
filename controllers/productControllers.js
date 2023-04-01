const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const handlers = require('./handlers');

const Product = require("../models/productModel");

// @desc    Get list of products
// @route   GET /api/v1/product
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    const docCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .pagination(docCount)
        .filter()
        .search("Product")
        .limitFields()
        .sort()
        .mongooseQueryExec();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res.status(200).json({
        results: products.length,
        paginationResult,
        data: products,
    });
});

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
