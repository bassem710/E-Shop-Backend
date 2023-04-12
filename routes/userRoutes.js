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

const router = express.Router();

router.put("/changePassword/:id", changeUserPasswordValidator, changeUserPassword);

router.route('/')
    .get(getUsers)
    .post(uploadUserImg, resizeImg, createUserValidator, addUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImg, resizeImg, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

    module.exports = router;