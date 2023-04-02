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

const subCategoriesRoutes = require('./subCategoryRoutes');

const router = express.Router();

router.use('/:categoryId/subCategories', subCategoriesRoutes);

router.route('/')
    .get(getCategories)
    .post(uploadCategoryImg, resizeImg, createCategoryValidator, addCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(uploadCategoryImg, resizeImg, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;