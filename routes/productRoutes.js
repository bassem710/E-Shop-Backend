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

const router = express.Router();


router.route('/')
    .get(getProducts)
    .post(uploadProductImages, resizeProductImgs, createProductValidator, addProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(uploadProductImages, resizeProductImgs, updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;