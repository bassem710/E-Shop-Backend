const { check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('subCategory is required')
        .isLength({min: 3}).withMessage('Too short subCategory name')
        .isLength({max: 32}).withMessage('Too long subCategory name'),
    check('category').notEmpty().withMessage('Main Category is required')
        .isMongoId().withMessage('Invalid Category id'),
    body('name').custom((val,{req}) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id'),
    body('name')
        .isLength({min: 3}).withMessage('Too short subcategory name')
        .isLength({max: 32}).withMessage('Too long subcategory name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category').notEmpty().withMessage('Main Category is required')
        .isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware,
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id'),
    validatorMiddleware,
]