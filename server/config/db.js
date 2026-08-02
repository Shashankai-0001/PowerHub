const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Error connecting to provided MONGO_URI: ${error.message}`);
        console.log('Starting MongoDB Memory Server as fallback...');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
    }
};

module.exports = connectDB;
