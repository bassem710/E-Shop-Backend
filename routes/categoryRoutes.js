const express = require('express');

const {
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryControllers');

const router = express.Router();

router.route('/').get(getCategories).post(addCategory);
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;