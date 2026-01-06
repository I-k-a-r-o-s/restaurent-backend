import { v2 as cloudinary } from "cloudinary";
import Menu from "../models/menuModel.js";
import {
  failure,
  missingResponse,
  notFoundResponse,
} from "../utils/responseHandlers.js";

/**
 * Add a new menu item to the restaurant menu
 * Requires admin authentication and image file
 */
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validate that all required fields are provided
    if (!name || !description || !price || !category || !req.file) {
      return missingResponse(res, "All fields are required");
    }

    // Upload item image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new menu item with details
    const newMenuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image: result.secure_url,
    });

    return res.status(201).json({
      message: "Menu item added successfully",
      success: true,
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.log("Error in addMenuItem:", error);
    return failure(res, "Failed to add menu item");
  }
};

/**
 * Retrieve all menu items with their category information
 * Sorted by most recently added first
 */
export const getAllMenuItems = async (req, res) => {
  try {
    // Find all menu items and populate category details (shows category name)
    const menuItems = await Menu.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Menu items fetched successfully",
      success: true,
      menuItems,
    });
  } catch (error) {
    console.log("Error in getAllMenuItems:", error);
    return failure(res, "Failed to fetch menu items");
  }
};

/**
 * Update an existing menu item
 * Can update any field: name, description, price, category, image, availability
 */
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params; // Get menu item ID from URL
    const { name, description, price, category, isAvailable } = req.body;

    // Find the menu item to update
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return notFoundResponse(res, "Menu item not found");
    }

    // Update image if new one is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      menuItem.image = result.secure_url;
    }

    // Update name if provided
    if (name) {
      menuItem.name = name;
    }

    // Update description if provided
    if (description) {
      menuItem.description = description;
    }

    // Update price if provided
    if (price) {
      menuItem.price = price;
    }

    // Update category if provided
    if (category) {
      menuItem.category = category;
    }

    // Update availability status if provided (can be true or false)
    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    }

    // Save updated menu item
    await menuItem.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      success: true,
      menuItem,
    });
  } catch (error) {
    console.log("Error in updateMenuItem:", error);
    return failure(res, "Failed to update menu item");
  }
};

/**
 * Delete a menu item from the system
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params; // Get menu item ID from URL

    // Find and delete the menu item
    const menuItem = await Menu.findByIdAndDelete(id);
    if (!menuItem) {
      return notFoundResponse(res, "Menu item not found");
    }

    return res.status(200).json({
      message: "Menu item deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in deleteMenuItem:", error);
    return failure(res, "Failed to delete menu item");
  }
};
