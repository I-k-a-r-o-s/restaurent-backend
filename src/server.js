import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const server = express();

// ===== Middleware Setup =====
// Parse incoming JSON request bodies
server.use(express.json());

// Enable Cross-Origin Resource Sharing (allows frontend to call this API)
server.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Parse cookies from requests (needed for JWT token handling)
server.use(cookieParser());

const port = process.env.PORT || 5000;

// ===== API Routes =====
// Mount all route handlers on their respective paths
server.use("/api/auth", authRoutes); // Authentication routes
server.use("/api/category", categoryRoutes); // Category management routes
server.use("/api/menu", menuRoutes); // Menu item routes
server.use("/api/cart", cartRoutes); // Shopping cart routes
server.use("/api/order", orderRoutes); // Order management routes
server.use("/api/bookings", bookingRoutes); // Table booking routes

/**
 * Initialize database and server
 * Connects to MongoDB and Cloudinary before starting the server
 */
const startDBConnection = async () => {
  try {
    // Connect to Cloudinary for image storage
    await connectCloudinary();

    // Connect to MongoDB database
    await connectDB();

    // Start Express server on specified port
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log("Connections Failed! :", error);
    process.exit(1); // Exit if connections fail
  }
};

// Start the application
startDBConnection();
