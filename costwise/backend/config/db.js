const mongoose = require('mongoose');

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 12; // retry for ~1 minute

const connectDB = async (retries = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (retries < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY_MS / 1000}s... (attempt ${retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retries + 1), RETRY_DELAY_MS);
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      console.error('Please check: 1) Atlas cluster is not paused  2) IP is whitelisted  3) Password is correct');
      console.error('Server will remain running but database operations will fail until MongoDB is available.');
    }
  }
};

module.exports = connectDB;
