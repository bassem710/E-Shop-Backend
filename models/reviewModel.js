const mongoose = require('mongoose');
const Product = require('./productModel');

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

reviewSchema.statics.calcAvgRatingAndQty = async function (productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {$group: {_id: 'product', ratingAvg: {$avg: '$rating'}, ratingQty: {$sum: 1}}}
    ]);
    // Update Product data
    if(result.length > 0){
        await Product.findByIdAndUpdate(productId,
            {
                ratingAvg: Number.parseFloat(result[0].ratingAvg).toFixed(1),
                ratingQty: result[0].ratingQty
            }
        );
    } else {
        await Product.findByIdAndUpdate(productId,
            {
                ratingAvg: 0,
                ratingQty: 0
            }
        );
    }
};

reviewSchema.post('save', async function(){
    await this.constructor.calcAvgRatingAndQty(this.product);
});

reviewSchema.post("deleteOne", {document:true, query: false}, async function(){
    await this.constructor.calcAvgRatingAndQty(this.product);
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;