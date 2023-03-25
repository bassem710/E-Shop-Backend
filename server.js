const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const dbConnection = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');

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

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
});