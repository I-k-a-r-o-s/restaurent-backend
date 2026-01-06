import { model, Schema } from "mongoose";

/**
 * Order Schema Definition
 * Represents a food order placed by a user
 */
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // Reference to User document
      ref: "User",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId, // Reference to Menu document
          ref: "Menu", // Reference to the Menu model
          required: true,
        },
        quantity: {
          type: Number, // How many of this item ordered
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number, // Total price of the order
      required: true,
    },
    address: {
      type: String, // Delivery address for the order
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Delivered"], // Possible order statuses
      default: "Pending", // Default status when order is created
    },
    paymentMethod: {
      type: String, // How payment will be made
      default: "Cash on Delivery",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Order = model("Order", orderSchema);
export default Order;
