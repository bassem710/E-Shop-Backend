const express = require('express');

const {
    addAddress,
    removeAddress,
    getUserAddresses,
} = require('../controllers/addressControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

// Protect
router.use(protect, allowedTo('user'));

router.route('/')
    .get(getUserAddresses)
    .post(addAddress)

router.route('/:addressId')
    .delete(removeAddress)

module.exports = router;