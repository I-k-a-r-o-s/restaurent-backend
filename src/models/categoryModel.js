import { model, Schema } from "mongoose";

/**
 * Category Schema Definition
 * Represents food categories (e.g., Appetizers, Main Course, Desserts)
 */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Each category name must be unique
      trim: true, // Removes whitespace from beginning/end
    },
    image: {
      type: String, // Stores URL of category image from cloud storage
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Category = model("Category", categorySchema);

export default Category;
