const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('FATAL: MONGODB_URI environment variable is not defined. Please set it in your .env file.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`[MongoDB Connected successfully]: ${conn.connection.host || 'Connected'}`);
        return conn;
    } catch (err) {
        console.error(`[MongoDB Connection Error]: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
