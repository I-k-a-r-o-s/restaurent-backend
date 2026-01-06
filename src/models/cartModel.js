import { Schema, model } from "mongoose";

/**
 * Cart Schema Definition
 * Represents a shopping cart containing items a user wants to order
 * Links to User and Menu models for data relationships
 */
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // Reference to User document by ID
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId, // Reference to Menu document by ID
          ref: "Menu", // Reference to the Menu model
          required: true,
        },
        quantity: {
          type: Number, // How many of this item in the cart
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Cart = model("Cart", cartSchema);

export default Cart;
