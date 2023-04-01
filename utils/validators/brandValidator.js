const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
    check("id").isMongoId().withMessage("Invalid brand id"),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 2 })
        .withMessage("Too short brand name")
        .isLength({ max: 32 })
        .withMessage("Too long brand name"),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    body("name")
        .isLength({min: 3}).withMessage('Too short brand name')
        .isLength({max: 32}).withMessage('Too long brand name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
]

exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid brand id"),
    validatorMiddleware,
];
