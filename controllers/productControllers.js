const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");

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
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
        path: "category",
        select: "name -_id",
    });
    if (!product) {
        return next(new ApiError(`Product (${id}) is not found`, 404));
    }
    res.status(200).json({ data: product });
});

// @desc    Create product
// @route   POST /api/v1/product
// @access  Private
exports.addProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
});

// @desc    Update specific product
// @route   PUT /api/v1/product/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
    });
    if (!product) {
        return next(new ApiError(`Product (${id}) is not found`, 404));
    }
    res.status(200).json({ data: product });
});

// @desc    Delete specific product
// @route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ApiError(`Product (${id}) is not found`, 404));
    }
    res.status(204).send();
});
