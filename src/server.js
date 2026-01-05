import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

const server = express();

//middleware
server.use(express.json());
server.use(cors());
server.use(cookieParser());

const port = process.env.PORT || 5000;

server.use("/api/auth", authRoutes);

const startDBConnection = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log("MongoDB Connection Failed! :", error);
    process.exit(1);
  }
};
startDBConnection();
