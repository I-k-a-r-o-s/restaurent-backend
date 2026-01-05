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

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/admin/login", adminLogin);
authRoutes.post("/logout", logoutUser);
authRoutes.get("/profile", protect, getProfile);

export default authRoutes;
