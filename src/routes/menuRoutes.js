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

menuRoutes.post("/add", adminOnly, upload.single("image"), addMenuItem);
menuRoutes.put(
  "/update/:id",
  adminOnly,
  upload.single("image"),
  updateMenuItem
);
menuRoutes.delete("/delete/:id", adminOnly, deleteMenuItem);
menuRoutes.get("/all", getAllMenuItems);

export default menuRoutes;
