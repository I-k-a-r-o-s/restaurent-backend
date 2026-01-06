import { Router } from "express";
import { adminOnly, protect } from "../middleware/authMiddleWare.js";
import { createBooking, getAllBookings, getUserBookings, updateBookingStatus } from "../controllers/bookingControler.js";

const bookingRoutes=Router()

bookingRoutes.post("/create",protect,createBooking)
bookingRoutes.get("/my-bookings",protect,getUserBookings)
bookingRoutes.get("/bookings",adminOnly,getAllBookings)
bookingRoutes.put("/update-status/:id",adminOnly,updateBookingStatus)

export default bookingRoutes