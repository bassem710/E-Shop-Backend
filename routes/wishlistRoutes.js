const express = require('express');

const {
    addProductToWishlist,
    removeProductFromWishlist,
    getUserWishlist,
} = require('../controllers/wishlistControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

// Protect
router.use(protect, allowedTo('user'));

router.route('/')
    .get(getUserWishlist)
    .post(addProductToWishlist)

router.route('/:productId')
    .delete(removeProductFromWishlist)

module.exports = router;