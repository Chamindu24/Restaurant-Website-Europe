import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Menu from "../models/menuModel.js";
import Offer from "../models/offerModel.js";
import { calculateCartTotals } from "../utils/offerEngine.js";

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { address, paymentMethod, phone } = req.body;
    
    if (!address || !phone)
      return res
        .status(400)
        .json({ message: "Delivery address and phone are required", success: false });

    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty", success: false });

    // SECURITY FIX: Recalculate totals SERVER-SIDE, never trust client
    // Fetch all active offers from database
    const offers = await Offer.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: new Date() } },
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: new Date() } },
          ]
        }
      ]
    });

    // Use offer engine to calculate accurate totals
    const { subtotal, totalDiscount, grandTotal } = calculateCartTotals(
      cart.items,
      offers,
      req.user // Pass user info for birthday/anniversary offers
    );

    const newOrder = await Order.create({
      user: id,
      items: cart.items.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
      })),
      subtotal: subtotal,
      discount: totalDiscount,
      totalAmount: grandTotal,
      address,
      phone,
      paymentMethod,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "order status updated", success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};
