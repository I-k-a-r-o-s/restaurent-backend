import { Router } from "express";
import { protect } from "../middleware/authMiddleWare.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";

const cartRoutes = Router();

/**
 * Cart Routes
 * Routes for shopping cart management (all require user authentication)
 */

// Add item to cart (requires authentication)
cartRoutes.post("/add", protect, addToCart);

// Get current user's cart (requires authentication)
cartRoutes.get("/get", protect, getCart);

// Remove item from cart (requires authentication)
cartRoutes.delete("/remove", protect, removeFromCart);

export default cartRoutes;
