const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const User = require("../../models/userModel");

exports.signupValidator = [
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
    validatorMiddleware,
];

exports.loginValidator = [
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address"),
        check("password")
            .notEmpty().withMessage("Password is required"),
    validatorMiddleware,
];
