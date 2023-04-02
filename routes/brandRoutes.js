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

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(uploadBrandImg, resizeImg, createBrandValidator, addBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadBrandImg, resizeImg, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

    module.exports = router;