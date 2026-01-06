import { Router } from "express";
import upload from "../middleware/multer.js";
import { adminOnly } from "../middleware/authMiddleWare.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = Router();

/**
 * Category Routes
 * Routes for managing food categories (admin only for write operations)
 */

// Add new category (admin only, requires image file)
categoryRoutes.post("/add", adminOnly, upload.single("image"), addCategory);

// Get all categories (public access)
categoryRoutes.get("/all", getAllCategories);

// Update category (admin only, image is optional)
categoryRoutes.put(
  "/update/:id",
  adminOnly,
  upload.single("image"),
  updateCategory
);

// Delete category (admin only)
categoryRoutes.delete("/delete/:id", adminOnly, deleteCategory);

export default categoryRoutes;
