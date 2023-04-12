const express = require('express');
const { 
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

const {
    signup,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword
} = require('../controllers/authControllers');

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verifyResetCode').post(verifyResetCode);
router.route('/resetPassword').put(resetPassword);

module.exports = router;