const mongoose = require('mongoose');
const dns = require('dns');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServerInstance = null;

const connectDB = async () => {
    try {
        // Set public DNS servers to resolve MongoDB Atlas SRV records if local ISP/router DNS blocks SRV queries
        try {
            dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
        } catch (dnsErr) {
            // fallback gracefully if dns.setServers fails in specific environments
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
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
