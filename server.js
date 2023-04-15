const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
require('colors');

const dbConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');

const mountRoutes = require('./routes');
const { webhookCheckout } = require('./controllers/orderControllers');

const PORT = process.env.PORT || 8000
dotenv.config();

// Connect Databse
dbConnection();

// Exprress App
const app = express();

// CORS
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

// Checkout Webhook
app.post('/webhook-checkout', 
    express.raw({ type: 'application/json'}), 
    webhookCheckout
)

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`.blue.bold);
}

// Routes
mountRoutes(app);

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