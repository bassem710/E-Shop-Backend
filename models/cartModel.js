const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product'
            },
            qty: {
                type: Number,
                default: 1
            },
            color: String,
            price: Number
        }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model("Cart", cartSchema);