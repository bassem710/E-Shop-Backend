const express = require('express');

const {
    createCashOrder
} = require('../controllers/orderControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/:cartId')
    .post(createCashOrder)

module.exports = router;