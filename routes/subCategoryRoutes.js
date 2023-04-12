const express = require('express');

const {
    getSubCategoryValidator, 
    createSubCategoryValidator, 
    updateSubCategoryValidator, 
    deleteSubCategoryValidator, 
} = require('../utils/validators/subCategoryValidator');

const {
    getSubCategories,
    getSubCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require('../controllers/subCategoryControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(protect, allowedTo('admin', 'manager'), setCategoryIdToBody, createSubCategoryValidator, addSubCategory);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin', 'manager'), deleteSubCategoryValidator, deleteSubCategory)

module.exports = router;