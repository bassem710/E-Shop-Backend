const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [100, 'Too long product title'],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product decription is required'],
        minlength: [20, 'Too short product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Product quantity must be greater than 0'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        min: 0,
        max: 10000000,
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors:[String],
    imageCover: {
        type: String,
        required: [true, 'Product image cover is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    }],
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },
    ratingAvg: {
        type: Number,
        min: [1, 'Rating must be greater than or equal 1.0'],
        max: [5, 'Rating must be smaller than or equal 5.0'],
    },
    ratingQty: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

productSchema.pre(/^find/, function(next){
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    this.populate({
        path: 'subCategories',
        select: 'name -_id',
    });
    next();
});

const setImgsUrl = (doc) => {
    if(doc.imageCover){
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`; 
        doc.imageCover = imageUrl;
    }
    if(doc.images){
        const images = [];
        doc.images.forEach( img => {
            const imageUrl = `${process.env.BASE_URL}/products/${img}`; 
            images.push(imageUrl);
        });
        doc.images = images;
    }
};

productSchema.post('init', setImgsUrl);
productSchema.post('save', setImgsUrl);

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;