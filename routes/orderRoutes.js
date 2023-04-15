const express = require('express');

const {
    createCashOrder,
    filterOrderForLoggedUser,
    getOrders,
    getOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    getCheckoutSesion
} = require('../controllers/orderControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:cartId', allowedTo('user'), getCheckoutSesion);

router.put('/:id/pay', allowedTo('manager', 'admin'), updateOrderToPaid);
router.put('/:id/deliver', allowedTo('manager', 'admin'), updateOrderToDelivered);

router.route('/:cartId')
    .post(allowedTo('user'), createCashOrder)

router.use(allowedTo('user', 'manager', 'admin'));

router.route('/')
    .get(filterOrderForLoggedUser, getOrders)

router.route('/:id')
    .get(getOrder)

module.exports = router;