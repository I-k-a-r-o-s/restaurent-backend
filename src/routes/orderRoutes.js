import { Router } from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleWare.js";

const orderRoutes = Router();

/**
 * Order Routes
 * Routes for placing orders and managing order statuses
 */

// Place new order from cart (requires user authentication)
orderRoutes.post("/place", protect, placeOrder);

// Get authenticated user's orders (requires user authentication)
orderRoutes.get("/my-orders", protect, getUserOrders);

// Get all orders in system (admin only)
orderRoutes.get("/orders", adminOnly, getAllOrders);

// Update order status (admin only)
orderRoutes.put("/update-status/:orderId", adminOnly, updateOrderStatus);

export default orderRoutes;
