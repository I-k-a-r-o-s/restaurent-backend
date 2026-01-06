import { Router } from "express";
import {
  adminLogin,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleWare.js";

const authRoutes = Router();

/**
 * Authentication Routes
 * Routes for user registration, login, logout, and profile access
 */

// Register a new user account
authRoutes.post("/register", registerUser);

// Login an existing user
authRoutes.post("/login", loginUser);

// Admin login with special credentials
authRoutes.post("/admin/login", adminLogin);

// Logout user (clear authentication cookie)
authRoutes.post("/logout", logoutUser);

// Get authenticated user's profile (requires valid JWT token)
authRoutes.get("/profile", protect, getProfile);

export default authRoutes;
