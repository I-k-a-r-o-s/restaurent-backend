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

categoryRoutes.post("/add", adminOnly, upload.single("image"), addCategory);
categoryRoutes.get("/add", getAllCategories);
categoryRoutes.put(
  "/update/:id",
  adminOnly,
  upload.single("image"),
  updateCategory
);
categoryRoutes.delete("/delete/:id", adminOnly, deleteCategory);

export default categoryRoutes;
