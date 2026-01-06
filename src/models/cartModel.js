import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // ObjectId type to reference another document
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "Menu", // Reference to the Menu model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);

export default Cart;
