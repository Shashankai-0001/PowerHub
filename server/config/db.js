const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServerInstance = null;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Atlas MONGO_URI unreachable (${error.message}). Starting local database server...`);
        try {
            if (!mongoServerInstance) {
                mongoServerInstance = await MongoMemoryServer.create();
            }
            const mongoUri = mongoServerInstance.getUri();
            const conn = await mongoose.connect(mongoUri);
            console.log(`Local Database Server Connected: ${conn.connection.host}`);
        } catch (memErr) {
            console.error('Failed to start local mongo server:', memErr);
        }
    }
};

module.exports = connectDB;
