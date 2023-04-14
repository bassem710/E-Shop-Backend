const express = require('express');

const {
    addProductToCart,
    getCart,
    removeItem,
    clearCart,
    updateItemQty,
    applyCoupon
} = require('../controllers/cartControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
.get(getCart)
.post(addProductToCart)
.delete(clearCart);

router.route('/applyCoupon')
    .put(applyCoupon)

router.route('/:itemId')
    .put(updateItemQty)
    .delete(removeItem);

    module.exports = router;