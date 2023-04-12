const express = require('express');
const { 
    getBrandValidator, 
    createBrandValidator, 
    updateBrandValidator, 
    deleteBrandValidator, 
} = require('../utils/validators/brandValidator');

const {
    uploadBrandImg,
    resizeImg,
    getBrands,
    getBrand,
    addBrand,
    updateBrand,
    deleteBrand,
} = require('../controllers/brandControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(protect, allowedTo('admin', 'manager'), uploadBrandImg, resizeImg, createBrandValidator, addBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('admin', 'manager'), uploadBrandImg, resizeImg, updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin', 'manager'), deleteBrandValidator, deleteBrand);

    module.exports = router;