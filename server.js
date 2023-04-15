const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// const hpp = require('hpp');
require('colors');

const dbConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./controllers/orderControllers');

// Port number
const PORT = process.env.PORT || 8000

// ENV
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
app.use(express.json({limit: "25kb"}));
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`.blue.bold);
}

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// HPP
// app.use(hpp({whitelist: ['filter', 'price', 'fields']}));

// Rate Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
    message: 'Too many accounts created from this IP, please try again after an hour'
});
app.use('/api/v1', limiter);

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