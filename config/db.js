const mongoose = require('mongoose');

const dbConnection = _ => {
    mongoose.connect(process.env.MONGO_URI)
    .then( conn => console.log(`Database Connected: ${conn.connection.host}`))
    .catch( err => {
        console.error(`Database Error: ${err}`);
        process.exit(1);
    });
}

module.exports = dbConnection;