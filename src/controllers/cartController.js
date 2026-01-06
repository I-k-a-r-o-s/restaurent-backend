import Cart from "../models/cartModel.js";
import Menu from "../models/menuModel.js";
import { failure, notFoundResponse } from "../utils/responseHandlers.js";

export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const { id } = req.user;

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return notFoundResponse(res, "Menu item not found!");
    }

    let cart = await Cart.findOne({ user: id });
    if (!cart) {
      cart = new Cart({ user: id, items: [] });
    }

    const existingItem = cart.items.find((item) => {
      item.menuItem.toString() === menuItemId;
    });
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }

    await cart.save();
    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Error in addToCart:", error);
    return failure(res, "Failed to add item to cart");
  }
};

export const getCart = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.log("Error in getCart:", error);
    return failure(res, "Failed to retrieve cart");
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { menuItemId } = req.body;

    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return notFoundResponse(res, "Cart Not Found");
    }

    cart.items = cart.items.filter((item) => {
      item.menuItem.toString() !== menuItemId;
    });

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
