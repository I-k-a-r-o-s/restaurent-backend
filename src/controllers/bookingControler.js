import Booking from "../models/bookingModel.js";
import {
  alreadyExistsResponse,
  failure,
  missingResponse,
  notFoundResponse,
} from "../utils/responseHandlers.js";

export const createBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, numberOfPeople, date, time, note } = req.body;
    if (!name || !phone || !numberOfPeople || !date || !time) {
      return missingResponse(res, "All Fields Are Required!");
    }

    //check overlapping bookings
    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $ne: "Cancelled" },
    });
    if (existingBooking) {
      return alreadyExistsResponse(res, "This Time Slot is Already Booked!");
    }

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

export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Successfully Fetched Bookings",
      bookings,
    });
  } catch (error) {
    console.log("Error in getUserBookings:", error);
    return failure(res, "Failed to Fetch Bookings");
  }
};

export const getAllBookings = async (req, res) => {
  try {
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

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return notFoundResponse(res, "Booking Unavailable!");
    }

    booking.status = status;
    await booking.save();
    return res.status(200).json(
        {
            message:"Booking Status Updated",
            success:true,
            booking
        }
    )
  } catch (error) {
    console.log("Error in updateBookingStatus:", error);
    return failure(res, "Failed to Update Bookings");
  }
};
