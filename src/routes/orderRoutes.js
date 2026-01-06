import { Router } from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleWare.js";

const orderRoutes = Router();

orderRoutes.post("/place", protect, placeOrder);
orderRoutes.get("/my-orders", protect, getUserOrders);
orderRoutes.get("/orders", adminOnly, getAllOrders);
orderRoutes.put("/update-status/:orderId", adminOnly, updateOrderStatus);

export default orderRoutes;
