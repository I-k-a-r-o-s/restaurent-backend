export const connectDB = async () => {
  try {
    await mongoose.connectDB(process.env.MONGODB_URI);
    console.log(`MongoDB Connection Initialized!`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
