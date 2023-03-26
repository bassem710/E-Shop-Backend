const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minLength: [2, 'Too short category name'],
        maxLength: [32, 'Too long category name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
}, {timestamps: true});

const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;