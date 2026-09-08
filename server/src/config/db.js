const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri === 'memory') {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB Server for local demo/testing...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(`InMemory MongoDB started at: ${mongoUri}`);
      } catch (memErr) {
        console.warn('Could not launch mongodb-memory-server. Defaulting to local mongodb://127.0.0.1:27017/lifelink');
        mongoUri = 'mongodb://127.0.0.1:27017/lifelink';
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If connection fails, attempt memory server fallback if not already used
    if (process.env.NODE_ENV !== 'production' && !process.env.MONGODB_FALLBACK_ATTEMPTED) {
      process.env.MONGODB_FALLBACK_ATTEMPTED = 'true';
      console.log('Attempting in-memory database fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log(`MongoDB Memory Fallback Connected at: ${memUri}`);
        return;
      } catch (fallbackErr) {
        console.error('Fallback in-memory database failed:', fallbackErr.message);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
