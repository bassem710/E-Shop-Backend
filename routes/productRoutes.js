const express = require('express');

const { 
    getProductValidator, 
    createProductValidator, 
    updateProductValidator, 
    deleteProductValidator, 
} = require('../utils/validators/productValidator');

const {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productControllers');

const router = express.Router();


router.route('/')
    .get(getProducts)
    .post(createProductValidator, addProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;