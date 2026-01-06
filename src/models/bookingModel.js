import { model, Schema } from "mongoose";

/**
 * Booking Schema Definition
 * Represents a restaurant table reservation made by a user
 */
const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // Reference to User document
      ref: "User",
      required: true,
    },
    name: {
      type: String, // Name of the person making the reservation
      required: true,
    },
    phone: {
      type: String, // Contact phone number
      required: true,
    },
    numberOfPeople: {
      type: Number, // How many people will be dining
      required: true,
      min: 1, // Minimum 1 person
    },
    date: {
      type: String, // Reservation date
      required: true,
    },
    time: {
      type: String, // Reservation time
      required: true,
    },
    note: {
      type: String, // Optional special requests or notes
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"], // Only these values allowed
      default: "Pending", // Default status when booking is created
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Booking = model("Booking", bookingSchema);

export default Booking;
