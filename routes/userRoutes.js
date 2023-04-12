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
} = require('../controllers/userControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router();

router.put("/changePassword/:id", changeUserPasswordValidator, changeUserPassword);

router.route('/')
    .get(protect, allowedTo('admin'), getUsers)
    .post(protect, allowedTo('admin'), uploadUserImg, resizeImg, createUserValidator, addUser);

router.route('/:id')
    .get(protect, allowedTo('admin'), getUserValidator, getUser)
    .put(protect, allowedTo('admin'), uploadUserImg, resizeImg, updateUserValidator, updateUser)
    .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

    module.exports = router;