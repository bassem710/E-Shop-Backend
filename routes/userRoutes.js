const express = require('express');
const { 
    getUserValidator, 
    createUserValidator, 
    updateUserValidator, 
    changeUserPasswordValidator,
    deleteUserValidator,
    updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const {
    uploadUserImg,
    resizeImg,
    getUsers,
    getUser,
    addUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUser,
} = require('../controllers/userControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

// Protect
router.use(protect);

// Logged user routes
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", changeUserPasswordValidator, updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUser);

// Allow routes to admin only
router.use(allowedTo('admin'));

// Admin routes
router.put("/changePassword/:id", changeUserPasswordValidator, changeUserPassword);

router.route('/')
    .get(getUsers)
    .post(uploadUserImg, resizeImg, createUserValidator, addUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImg, resizeImg, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

    module.exports = router;