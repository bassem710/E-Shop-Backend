const express = require('express');

const {
    getCoupons,
    getCoupon,
    addCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

// Protect/admin-manager
router.use(protect, allowedTo('admin', 'manager'));

router.route('/')
    .get(getCoupons)
    .post(addCoupon);

router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon);

    module.exports = router;