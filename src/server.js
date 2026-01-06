import dotenv from "dotenv";
dotenv.config();

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

const server = express();

//middleware
server.use(express.json());
server.use(cors());
server.use(cookieParser());

const port = process.env.PORT || 5000;

server.use("/api/auth", authRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/menu",menuRoutes)
server.use("/api/cart",cartRoutes)
server.use("/api/order",orderRoutes)

const startDBConnection = async () => {
  try {
    await connectCloudinary();
    await connectDB();
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log("Connections Failed! :", error);
    process.exit(1);
  }
};
startDBConnection();
