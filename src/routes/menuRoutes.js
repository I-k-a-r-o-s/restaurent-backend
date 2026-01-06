import { Router } from "express";
import { adminOnly } from "../middleware/authMiddleWare.js";
import {
  addMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  updateMenuItem,
} from "../controllers/menuControllers.js";
import upload from "../middleware/multer.js";

const menuRoutes = Router();

/**
 * Menu Routes
 * Routes for managing menu items (admin only for write operations)
 */

// Add new menu item (admin only, requires image file)
menuRoutes.post("/add", adminOnly, upload.single("image"), addMenuItem);

// Update menu item (admin only, image is optional)
menuRoutes.put(
  "/update/:id",
  adminOnly,
  upload.single("image"),
  updateMenuItem
);

// Delete menu item (admin only)
menuRoutes.delete("/delete/:id", adminOnly, deleteMenuItem);

// Get all menu items (public access)
menuRoutes.get("/all", getAllMenuItems);

export default menuRoutes;
