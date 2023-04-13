const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('colors');

const dbConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');

const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const PORT = process.env.PORT || 8000
dotenv.config();

// Connect Databse
dbConnection();

// Exprress App
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`.blue.bold);
}

// Routes
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/subCategory', subCategoryRoutes);
app.use('/api/v1/brand', brandRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/review', reviewRoutes);

app.all('*', (req, res ,next) => {
    next(new ApiError(`This Route (${req.originalUrl}) is not found`, 400))
});

// Global error handling middleware
app.use(globalError);

const server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}` .blue.bold);
});

// Handle rejection outside express app
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
    server.close( () => {
        console.error(`Shutting down...`.red.inverse);
        process.exit(1);
    });
})