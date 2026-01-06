import { model, Schema } from "mongoose";

/**
 * Menu Schema Definition
 * Represents a food item available in the restaurant menu
 */
const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from beginning/end
    },
    description: {
      type: String, // Details about the dish (ingredients, preparation, etc.)
      required: true,
    },
    price: {
      type: Number, // Cost of the menu item
      required: true,
    },
    image: {
      type: String, // Stores URL of menu item image from cloud storage
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId, // Reference to Category document
      ref: "Category", // Reference to Category model
      required: true,
    },
    isAvailable: {
      type: Boolean, // Whether item is currently available to order
      default: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Menu = model("Menu", menuSchema);
export default Menu;
