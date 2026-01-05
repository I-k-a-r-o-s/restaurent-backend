import { v2 as cloudinary } from "cloudinary";
import Category from "../models/categoryModel.js";
import {
  alreadyExistsResponse,
  failure,
  missingResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandlers.js";

// Add Category Controller
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return missingResponse(res, "Please provide category name and image");
    }

    const alreadyExists = await Category.findOne({ name });
    if (alreadyExists) {
      return alreadyExistsResponse(res, "Category already exists");
    }

    const result = await cloudinary.uploader.upload(req.file.path);
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
    return failure(res, "Failed to add category");
  }
};

// Get All Categories Controller
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      categories,
    });
  } catch (error) {
    return failure(res, "Failed to fetch categories");
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return notFoundResponse(res, "Category not found");
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      category.image = result.secure_url;
    }
    if (name) {
      category.name = name;
    }
    await category.save();
    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
      category,
    });
  } catch (error) {
    return failure(res, "Failed to update category");
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return notFoundResponse(res, "Category not found");
    }
    return successResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    return failure(res, "Failed to delete category");
  }
};
