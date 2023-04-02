const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minLength: [3, 'Too short category name'],
        maxLength: [32, 'Too long category name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
}, {timestamps: true});

const setImgUrl = (doc) => {
    if(doc.image){
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`; 
        doc.image = imageUrl;
    }
};

categorySchema.post('init', setImgUrl);
categorySchema.post('save', setImgUrl);

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;