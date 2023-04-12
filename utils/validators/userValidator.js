const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const User = require("../../models/userModel");

exports.getUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id"),
    validatorMiddleware,
];

exports.createUserValidator = [
    check("name")
        .notEmpty()
        .withMessage("User required")
        .isLength({ min: 2 })
        .withMessage("Too short user name")
        .isLength({ max: 32 })
        .withMessage("Too long user name"),
    body('name').custom((val,{req}) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .custom( (val) => User.findOne({email: val}).then( user => {
            if(user){
                return Promise.reject(new Error("Email already exists"));
            }
        })),
        check("password")
            .notEmpty().withMessage("Password is required")
            .isLength({min: 6}).withMessage("Too short password")
            .custom( (password, {req}) => {
                if(password !== req.body.confirmPassword){
                    throw new Error("Passwords don't match");
                }
                return true;
            }),
        check("confirmPassword")
            .notEmpty().withMessage("Confirm password is required"),
        check("phone")
            .optional()
            .isMobilePhone(['ar-EG']).withMessage("Invalid phone number"),
        check("profileImg").optional(),
        check("role").optional(),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    check("name")
        .notEmpty()
        .withMessage("User required")
        .isLength({ min: 2 })
        .withMessage("Too short user name")
        .isLength({ max: 32 })
        .withMessage("Too long user name"),
    body('name').custom((val,{req}) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .custom( (val) => User.findOne({email: val}).then( user => {
            if(user){
                return Promise.reject(new Error("Email already exists"));
            }
        })),
        check("phone")
            .optional()
            .isMobilePhone(['ar-EG']).withMessage("Invalid phone number"),
        check("profileImg").optional(),
        check("role").optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required"),
    body("confirmPassword")
        .notEmpty().withMessage("Confirm password is required"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .custom( async (password, {req}) => {
            // Verify old password
            const user = await User.findById(req.user._id?req.user._id:req.params.id);
            if(!user){
                throw new Error("User doesn't exist");
            }
            const passwordsMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if(!passwordsMatch) throw new Error("Incorrect old password");
            // Confirm new password
            if(password !== req.body.confirmPassword) throw new Error("Passwords do not match");
            if(password === req.body.currentPassword) throw new Error("This already your current password");
            return true;
        }),
        validatorMiddleware,
];

exports.deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id"),
    validatorMiddleware,
];
