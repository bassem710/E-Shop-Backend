const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    titel: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, 'Min rating is 1.0'],
        max: [5, 'Max rating is 5.0'],
        required: [true, "Rating is required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to product']
    },
}, {timestamps: true});

reviewSchema.pre(/^find/, function (next){
    this.populate({path: 'user', select: 'name'});
    next();
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;