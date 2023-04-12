const express = require('express');
const { 
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

const {
    signup,
    login,
} = require('../controllers/authControllers');

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);

// router.route('/:id')
//     .get(getUserValidator, getUser)
//     .put(uploadUserImg, resizeImg, updateUserValidator, updateUser)
//     .delete(deleteUserValidator, deleteUser);

    module.exports = router;