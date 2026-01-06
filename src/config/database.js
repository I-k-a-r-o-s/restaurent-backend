import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * Reads connection string from MONGODB_URI environment variable
 * Establishes connection to MongoDB cluster
 */
export const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connection Initialized!`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process if connection fails
  }
};
