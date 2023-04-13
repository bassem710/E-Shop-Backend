const { check } = require("express-validator");
const Review = require('../../models/reviewModel');
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getReviewValidator = [
    check("id").isMongoId().withMessage("Invalid Review id"),
    validatorMiddleware,
];

exports.createReviewValidator = [
    check("title")
        .optional()
        .isLength({ min: 3 }).withMessage("Too short Review title")
        .isLength({ max: 32 }).withMessage("Too long Review title"),
    check("rating")
        .notEmpty().withMessage("Rating value is required")
        .isFloat({min:1, max:5}).withMessage("Rating value must be between 1 & 5"),
    check("user")
        .isMongoId().withMessage("Invalid user id format"),
    check("product")
        .isMongoId().withMessage("Invalid product id format")
        .custom( async (val, {req}) => {
            const reviewExists = await Review.findOne({user: req.user._id, product: req.body.product})
                if(reviewExists){
                    return Promise.reject(new Error("You already created a review before"))
                }

        }),
    validatorMiddleware,
];

exports.updateReviewValidator = [
    check("id")
        .isMongoId().withMessage("Invalid Review id format")
        .custom( async (val, {req}) => {
            const review = await Review.findById(val);
            if(!review){
                return Promise.reject(new Error("Review does not exist"));
            }
            if(review.user.toString() !== req.user._id.toString()){
                return Promise.reject(new Error("Not authorized to update this review"));
            }
        }),
    check("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short Review title")
        .isLength({ max: 32 })
        .withMessage("Too long Review title"),
    check("rating")
        .optional()
        .isFloat({min:1, max:5}).withMessage("Rating value must be between 1 & 5"),
    validatorMiddleware,
]

exports.deleteReviewValidator = [
    check("id")
        .isMongoId().withMessage("Invalid Review id")
        .custom( async (val, {req}) => {
            if(req.user.role === "user"){
                const review = await Review.findById(val);
                if(!review){
                    return Promise.reject(new Error("Review does not exist"));
                }
                if(review.user._id.toString() !== req.user._id.toString()){
                    return Promise.reject(new Error("Not authorized to update this review"));
                }
            }
        }),
    validatorMiddleware,
];
