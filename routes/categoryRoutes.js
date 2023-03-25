const express = require('express');

const {
    addCategory
} = require('../controllers/categoryControllers');

const router = express.Router();

router.post('/', addCategory);

module.exports = router;