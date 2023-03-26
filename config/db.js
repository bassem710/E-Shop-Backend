const mongoose = require('mongoose');
require('colors');

const dbConnection = _ => {
    mongoose.connect(process.env.MONGO_URI)
    .then( conn => console.log(`Database Connected: ${conn.connection.host}`.green.bold));
}

module.exports = dbConnection;