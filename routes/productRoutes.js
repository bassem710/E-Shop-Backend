const express = require('express');

const { 
    getProductValidator, 
    createProductValidator, 
    updateProductValidator, 
    deleteProductValidator, 
} = require('../utils/validators/productValidator');

const {
    uploadProductImages,
    resizeProductImgs,
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productControllers');

const {protect, allowedTo} = require('../controllers/authControllers');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// Nested Routes
router.use('/:productId/reviews', reviewRoutes);

router.route('/')
    .get(getProducts)
    .post(protect, allowedTo('admin', 'manager'), uploadProductImages, resizeProductImgs, createProductValidator, addProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('admin', 'manager'), uploadProductImages, resizeProductImgs, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin', 'manager'), deleteProductValidator, deleteProduct);

module.exports = router;