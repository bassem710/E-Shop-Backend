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

const router = express.Router({mergeParams: true});

router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(setCategoryIdToBody, createSubCategoryValidator, addSubCategory);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)

module.exports = router;