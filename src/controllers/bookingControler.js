import Booking from "../models/bookingModel.js";
import {
  alreadyExistsResponse,
  failure,
  missingResponse,
  notFoundResponse,
} from "../utils/responseHandlers.js";

/**
 * Create a new table booking
 * Validates input, checks for existing bookings at the same time
 */
export const createBooking = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request
    const { name, phone, numberOfPeople, date, time, note } = req.body;

    // Validate that all required fields are provided
    if (!name || !phone || !numberOfPeople || !date || !time) {
      return missingResponse(res, "All Fields Are Required!");
    }

    // Check if a booking already exists for the same date/time (to prevent double booking)
    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $ne: "Cancelled" }, // Exclude cancelled bookings
    });
    if (existingBooking) {
      return alreadyExistsResponse(res, "This Time Slot is Already Booked!");
    }

    // Create new booking with provided information
    const booking = await Booking.create({
      user: id,
      name,
      phone,
      numberOfPeople,
      date,
      time,
      note,
    });

    return res.status(201).json({
      message: "Table Booked Successfully",
      success: true,
      booking,
    });
  } catch (error) {
    console.log("Error in createBooking:", error);
    return failure(res, "Failed to Create Booking");
  }
};

/**
 * Get all bookings for the authenticated user
 * Returns bookings sorted by most recent first
 */
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request

    // Find all bookings for this user and sort by creation date (newest first)
    const bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Successfully Fetched Bookings",
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Error in getUserBookings:", error);
    return failure(res, "Failed to Fetch Bookings");
  }
};

/**
 * Get all bookings in the system (admin only)
 * Includes user information with each booking
 */
export const getAllBookings = async (req, res) => {
  try {
    // Find all bookings and populate user details (name, email)
    const bookings = await Booking.find().populate("user", "name email");

    return res.status(200).json({
      message: "Successfully Fetched Bookings",
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Error in getAllBookings:", error);
    return failure(res, "Failed to Fetch Bookings");
  }
};

/**
 * Update the status of a booking (admin only)
 * Status can be: Pending, Approved, or Cancelled
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get booking ID from URL parameters
    const { status } = req.body; // Get new status from request body

    // Find the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return notFoundResponse(res, "Booking Unavailable!");
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    return res.status(200).json({
      message: "Booking Status Updated",
      success: true,
      booking,
    });
  } catch (error) {
    console.log("Error in updateBookingStatus:", error);
    return failure(res, "Failed to Update Bookings");
  }
};
