const express = require('express');
const { 
    getUserValidator, 
    createUserValidator, 
    updateUserValidator, 
    deleteUserValidator, 
} = require('../utils/validators/userValidator');

const {
    uploadUserImg,
    resizeImg,
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(uploadUserImg, resizeImg, createUserValidator, addUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImg, resizeImg, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

    module.exports = router;