const express = require('express');
const { 
    getUserValidator, 
    createUserValidator, 
    updateUserValidator, 
    changeUserPasswordValidator,
    deleteUserValidator, 
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
    updateLoggedUserPassword
} = require('../controllers/userControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

// Logged user routes
router.get("/getMe", protect, getLoggedUserData, getUser);
router.put("/changeMyPassword", protect, changeUserPasswordValidator, updateLoggedUserPassword);

// Protect/admin
router.use(protect, allowedTo('admin'));

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