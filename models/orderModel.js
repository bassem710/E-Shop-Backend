const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "User is required"]
    },
    cartItems: [
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
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
    },
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    totalOrderPrice: Number,
    paymentMethod: {
        type: String,
        enum: ["card", "cash"],
        default: "cash",
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
}, {timestamps: true});

orderSchema.pre(/^find/, function(next){
    this.populate({path:'user', select: 'name profileImg email phone'})
        .populate({path:'cartItems.product', select: 'title brand'});
    next();
})

module.exports = mongoose.model("Order", orderSchema);