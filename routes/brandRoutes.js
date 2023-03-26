const express = require('express');
const { 
    getBrandValidator, 
    createBrandValidator, 
    updateBrandValidator, 
    deleteBrandValidator, 
} = require('../utils/validators/brandValidator');

const {
    getBrands,
    getBrand,
    addBrand,
    updateBrand,
    deleteBrand,
} = require('../controllers/brandControllers');

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(createBrandValidator, addBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

    module.exports = router;