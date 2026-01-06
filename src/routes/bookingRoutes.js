import { Router } from "express";
import { adminOnly, protect } from "../middleware/authMiddleWare.js";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
} from "../controllers/bookingControler.js";

const bookingRoutes = Router();

/**
 * Booking Routes
 * Routes for table reservation management
 */

// Create new table booking (requires user authentication)
bookingRoutes.post("/create", protect, createBooking);

// Get authenticated user's bookings (requires user authentication)
bookingRoutes.get("/my-bookings", protect, getUserBookings);

// Get all bookings in system (admin only)
bookingRoutes.get("/bookings", adminOnly, getAllBookings);

// Update booking status (admin only)
bookingRoutes.put("/update-status/:id", adminOnly, updateBookingStatus);

export default bookingRoutes;
