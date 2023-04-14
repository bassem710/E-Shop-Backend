const categoryRoutes = require('./categoryRoutes');
const subCategoryRoutes = require('./subCategoryRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const reviewRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const addressRoutes = require('./addressRoutes');
const couponRoutes = require('./couponRoutes');
const cartRoutes = require('./cartRoutes');

const mountRoutes = app => {
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/subCategory', subCategoryRoutes);
    app.use('/api/v1/brand', brandRoutes);
    app.use('/api/v1/product', productRoutes);
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/review', reviewRoutes);
    app.use('/api/v1/wishlist', wishlistRoutes);
    app.use('/api/v1/address', addressRoutes);
    app.use('/api/v1/coupon', couponRoutes);
    app.use('/api/v1/cart', cartRoutes);
};

module.exports = mountRoutes;

