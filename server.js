const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const dbConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');

const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');

const PORT = process.env.PORT || 8000
dotenv.config();

// Connect Databse
dbConnection();

// Exprress App
const app = express();

// Middlewares
app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Routes
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/subCategory', subCategoryRoutes);

app.all('*', (req, res ,next) => {
    next(new ApiError(`This Route (${req.originalUrl}) is not found`, 400))
});

// Global error handling middleware
app.use(globalError);

const server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
});

// Handle rejection outside express app
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
    server.close( () => {
        console.error(`Shutting down...`);
        process.exit(1);
    });
})