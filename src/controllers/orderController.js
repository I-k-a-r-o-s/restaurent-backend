import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import {
  failure,
  missingResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandlers.js";

/**
 * Place a new order from the user's cart
 * Calculates total amount and clears the cart after order creation
 */
export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request
    const { address,paymentMethod } = req.body; // Get delivery address

    // Validate delivery address is provided
    if (!address) {
      return missingResponse(res, "Address is Missing");
    }

    // Get user's cart with menu item details
    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    // Check if cart exists and has items
    if (!cart || cart.items.length === 0) {
      return missingResponse(res, "Cart is Empty");
    }

    // Calculate total amount by summing (price × quantity) for each item
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0,
    );

    // Create new order with items from cart
    const newOrder = await Order.create({
      user: id,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      paymentMethod
    });

    // Clear the cart items after successful order placement
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order Placed Successfully",
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.log("Error in placeOrder:", error);
    return failure(res, "Failed to Place Order");
  }
};

/**
 * Get all orders for the authenticated user
 * Sorted by most recent first
 */
export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request

    // Find all orders for this user and sort by creation date (newest first)
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error in getUserOrders:", error);
    return failure(res, "Failed to Fetch Orders");
  }
};

/**
 * Get all orders in the system (admin only)
 * Includes user information with each order
 */
export const getAllOrders = async (req, res) => {
  try {
    // Find all orders and populate user details
    const orders = await Order.find()
      .populate("user")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error in getAllOrders:", error);
    return failure(res, "Failed to Fetch Orders");
  }
};

/**
 * Update the status of an order (admin only)
 * Status can be: Pending, Preparing, or Delivered
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Get order ID from URL
    const { status } = req.body; // Get new status from request body

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return notFoundResponse(res, "Order Not Found!");
    }

    // Update the order status
    order.status = status;

    // Save updated order
    await order.save();

    return successResponse(res, 200, "Order Status Updated");
  } catch (error) {
    console.log("Error in updateOrderStatus:", error);
    return failure(res, "Failed to Update Order Status");
  }
};
