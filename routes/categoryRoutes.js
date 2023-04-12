const express = require('express');

const { 
    getCategoryValidator, 
    createCategoryValidator, 
    updateCategoryValidator, 
    deleteCategoryValidator, 
} = require('../utils/validators/categoryValidator');

const {
    uploadCategoryImg,
    resizeImg,
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const subCategoriesRoutes = require('./subCategoryRoutes');

const router = express.Router();

router.use('/:categoryId/subCategories', subCategoriesRoutes);

router.route('/')
    .get(getCategories)
    .post(protect, allowedTo('admin', 'manager'), uploadCategoryImg, resizeImg, createCategoryValidator, addCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('admin', 'manager'), uploadCategoryImg, resizeImg, updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('admin', 'manager'), deleteCategoryValidator, deleteCategory);

module.exports = router;