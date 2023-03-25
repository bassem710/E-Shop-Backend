const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'SubCategory required'],
        unique: [true, 'SubCategory must be unique'],
        minLength: [2, 'Too short Subcategory name'],
        maxLength: [32, 'Too long Subcategory name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must have main category name'],
    },
}, {timestamps: true});

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;