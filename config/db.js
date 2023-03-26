const mongoose = require('mongoose');
require('colors');

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then( conn => console.log(`Database Connected: ${conn.connection.host}`.green.bold));
}

module.exports = dbConnection;