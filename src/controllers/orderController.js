import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import {
  failure,
  missingResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandlers.js";

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { address } = req.body;

    if (!address) {
      return missingResponse(res, "Address is Missing");
    }

    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return missingResponse(res, "Cart is Empty");
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      user: id,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
    });

    //clear the cart
    cart.items = [];
    await cart.save();
    return res.status(201).json({
      message: "Order Placed Succesfully",
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.log("Error in placeOrder:", error);
    return failure(res, "Failed to Place Order");
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;

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

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .toSorted({ createdAt: -1 });
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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return notFoundResponse(res, "Order Not Found!");
    }

    order.status = status;

    await order.save();
    return successResponse(res, 200, "Order Status Updated");
  } catch (error) {
    console.log("Error in updateOrderStatus:", error);
    return failure(res, "Failed to Update Order Status");
  }
};
