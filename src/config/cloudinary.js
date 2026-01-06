import { v2 as cloudinary } from "cloudinary";

/**
 * Initialize Cloudinary configuration
 * Cloudinary is a cloud storage service for images
 * Reads API credentials from environment variables for security
 */
const connectCloudinary = async () => {
  try {
    // Configure Cloudinary with API credentials from .env file
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Connection Initialized!");
  } catch (error) {
    console.log("Cloudinary Connection Error:", error);
  }
};

export default connectCloudinary;
