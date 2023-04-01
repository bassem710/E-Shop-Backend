const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const handlers = require('./handlers');

const Brand = require('../models/brandModel');

// @desc    Get list of brands
// @route   GET /api/v1/brand
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
    const docCount = await Brand.countDocuments();
    const apiFeatures = new ApiFeatures(Brand.find(), req.query)
        .pagination(docCount)
        .filter()
        .search()
        .limitFields()
        .sort()
        .mongooseQueryExec();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res.status(200).json({
        results: brands.length,
        paginationResult,
        data: brands
    })
});

// @desc    Get specific brand
// @route   GET /api/v1/brand/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if(!brand){
        return next(new ApiError(`Brand (${id}) is not found`, 404));
    }
    res.status(200).json({data: brand});
});

// @desc    Create brand
// @route   POST /api/v1/brand
// @access  Private
exports.addBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.create({name, slug: slugify(name)});
    res.status(201).json({data: brand});
});

// @desc    Update specific brand
// @route   PUT /api/v1/brand/:id
// @access  Private
exports.updateBrand = handlers.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brand/:id
// @access  Private
exports.deleteBrand = handlers.deleteOne(Brand);