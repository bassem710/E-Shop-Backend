const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const handlers = require('./handlers');
const { uploadListOfImgs } = require('../middlewares/uploadImageMiddleware');

exports.uploadProductImages = uploadListOfImgs([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 5},
]);

exports.resizeProductImgs = asyncHandler(async (req, res, next) => {
    if(req.files.imageCover){
        const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`uploads/products/${imageCoverFilename}`);
        req.body.imageCover = imageCoverFilename;
    }
    if(req.files.images){
        req.body.images = [];
        await Promise.all(
            req.files.images.map( async (img, ind) => {
                const imgName = `product-${uuidv4()}-${Date.now()}-${ind+1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({quality: 90})
                    .toFile(`uploads/products/${imgName}`);
                req.body.images.push(imgName);
            })
        );
    }
    next();
});

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
