const express = require('express');
const { 
    getReviewValidator, 
    createReviewValidator, 
    updateReviewValidator, 
    deleteReviewValidator, 
} = require('../utils/validators/reviewValidator');

const {
    createFilterObj,
    setProductAndUserIdToBody,
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviewControllers');

const {protect, allowedTo} = require('../controllers/authControllers');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(createFilterObj, getReviews)
    .post(protect, allowedTo('user'), setProductAndUserIdToBody, createReviewValidator, addReview);

router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
    .delete(protect, allowedTo('user','admin', 'manager'), deleteReviewValidator, deleteReview);

    module.exports = router;