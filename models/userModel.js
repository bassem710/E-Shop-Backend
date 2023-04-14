const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name required']
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: [6, "Too short password"]
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExp: Date,
    passwordResetCodeVerified: Boolean,
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },
    active:{
        type: Boolean,
        default: true
    },
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    }],
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified()) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;