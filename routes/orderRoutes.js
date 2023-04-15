const express = require('express');

const {
    createCashOrder,
    filterOrderForLoggedUser,
    getOrders,
    getOrder,
} = require('../controllers/orderControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/:cartId')
    .post(allowedTo('user'), createCashOrder)

router.use(allowedTo('user', 'manager', 'admin'));

router.route('/')
    .get(filterOrderForLoggedUser, getOrders)

router.route('/:id')
    .get(getOrder)

module.exports = router;