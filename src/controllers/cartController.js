import Cart from "../models/cartModel.js";
import Menu from "../models/menuModel.js";
import {
  failure,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandlers.js";

/**
 * Add an item to the user's shopping cart
 * Creates a cart if it doesn't exist, or updates quantity if item already in cart
 */
export const addToCart = async (req, res) => {
  try {
    const { menuId, quantity } = req.body;
    const { id } = req.user; // Get user ID from authenticated request

    // Verify that the menu item exists
    const menuItem = await Menu.findById(menuId);
    if (!menuItem) {
      return notFoundResponse(res, "Menu item not found!");
    }

    // Find existing cart for user, or create a new one
    let cart = await Cart.findOne({ user: id });
    if (!cart) {
      cart = new Cart({ user: id, items: [] });
    }

    // Check if item is already in the cart
    const existingItem = cart.items.find((item) => {
      return item.menuItem.toString() === menuId; // FIX: Added return statement
    });

    if (existingItem) {
      // If item exists, increase its quantity
      existingItem.quantity += quantity;
    } else {
      // If new item, add it to cart
      cart.items.push({ menuItem: menuId, quantity });
    }

    // Save cart to database
    await cart.save();
    return res.status(200).json({
      message: "Item added to cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Error in addToCart:", error);
    return failure(res, "Failed to add item to cart");
  }
};

/**
 * Get the current user's shopping cart
 * Includes detailed information about each menu item
 */
export const getCart = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request

    // Find cart and populate menu item details
    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    // Return empty cart if none exists
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    return res.status(200).json({
      message: "Cart retrieved successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Error in getCart:", error);
    return failure(res, "Failed to retrieve cart");
  }
};

/**
 * Remove an item from the user's shopping cart
 * Filters out the specified menu item
 */
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request
    const { menuId } = req.params; // Get menu item ID to remove

    // Find user's cart
    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return notFoundResponse(res, "Cart Not Found");
    }

    // Remove the specified item from cart items array
    cart.items = cart.items.filter((item) => {
      return item.menuItem.toString() !== menuId; // FIX: Added return statement
    });

    // Save updated cart
    await cart.save();
    return res.status(200).json({
      message: "Item removed from the cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    return failure(res, "Failed to remove from cart");
  }
};
