import User from "../Models/userModel.js";
import Tutor from "../Models/tutorModel.js";
import Order from "../Models/orderModel.js";
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // sorted by newest first
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ role: "tutor" }).sort({ createdAt: -1 });
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tutors" });
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // sorted by newest first
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
