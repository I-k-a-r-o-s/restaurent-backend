import { v2 as cloudinary } from "cloudinary";
import Menu from "../models/menuModel.js";
import {
  failure,
  missingResponse,
  notFoundResponse,
} from "../utils/responseHandlers.js";

export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category || !req.file) {
      return missingResponse(res, "All fields are required");
    }

    const result = await cloudinary.uploader.upload(req.file.path);
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

export const getAllMenuItems = async (req, res) => {
  try {
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

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return notFoundResponse(res, "Menu item not found");
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      menuItem.image = result.secure_url;
    }

    if (name) {
      menuItem.name = name;
    }

    if (description) {
      menuItem.description = description;
    }

    if (price) {
      menuItem.price = price;
    }

    if (category) {
      menuItem.category = category;
    }

    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    }

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

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
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
