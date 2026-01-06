import { v2 as cloudinary } from "cloudinary";
import Category from "../models/categoryModel.js";
import {
  alreadyExistsResponse,
  failure,
  missingResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandlers.js";

/**
 * Add a new food category to the system
 * Requires admin authentication and image file
 */
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that name and image are provided
    if (!name || !req.file) {
      return missingResponse(res, "Please provide category name and image");
    }

    // Check if category with same name already exists
    const alreadyExists = await Category.findOne({ name });
    if (alreadyExists) {
      return alreadyExistsResponse(res, "Category already exists");
    }

    // Upload image to Cloudinary cloud storage
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new category with image URL
    const newCategory = await Category.create({
      name,
      image: result.secure_url,
    });

    return res.status(201).json({
      message: "Category added successfully",
      success: true,
      category: newCategory,
    });
  } catch (error) {
    console.log("Error in addCategory:", error);
    return failure(res, "Failed to add category");
  }
};

/**
 * Retrieve all food categories from the system
 * Sorted by most recently created first
 */
export const getAllCategories = async (req, res) => {
  try {
    // Find all categories and sort by creation date (newest first)
    const categories = await Category.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      categories,
    });
  } catch (error) {
    console.log("Error in getAllCategories:", error);
    return failure(res, "Failed to fetch categories");
  }
};

/**
 * Update an existing category
 * Can update name and/or image
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from URL
    const { name } = req.body; // Get new name if provided

    // Find the category to update
    const category = await Category.findById(id);
    if (!category) {
      return notFoundResponse(res, "Category not found");
    }

    // Update image if new one is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      category.image = result.secure_url;
    }

    // Update name if provided
    if (name) {
      category.name = name;
    }

    // Save updated category
    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
      category,
    });
  } catch (error) {
    console.log("Error in updateCategory:", error);
    return failure(res, "Failed to update category");
  }
};

/**
 * Delete a category from the system
 * This removes the category but not associated menu items
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from URL

    // Find and delete the category
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return notFoundResponse(res, "Category not found");
    }

    return successResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    console.log("Error in deleteCategory:", error);
    return failure(res, "Failed to delete category");
  }
};
