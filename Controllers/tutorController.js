import mongoose from "mongoose";
import Tutor from "../Models/tutorModel.js";
import Order from "../Models/orderModel.js";

export const updateTutorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Tutor ID format", success: false });
    }

    const { skill, image, degree, accNo } = req.body;

    if (!skill || !image || !degree || !accNo) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Ensure the tutor exists before updating
    const existingTutor = await Tutor.findById(id);
    if (!existingTutor) {
      return res
        .status(404)
        .json({ message: "Tutor not found", success: false });
    }

    const updatedTutor = await Tutor.findByIdAndUpdate(
      id,
      { skill, image, degree, accNo },
      { new: true }
    );

    if (!updatedTutor) {
      return res
        .status(404)
        .json({ message: "Tutor not found", success: false });
    }

    res.status(200).json({
      message: "Tutor profile updated successfully",
      user: updatedTutor,
      success: true,
    });
  } catch (error) {
    console.error("Error updating tutor profile:", error); // More detailed error log
    res
      .status(500)
      .json({ message: "Error updating tutor profile", success: false });
  }
};

export const updateOnlineStatus = async (req, res) => {
  const { isOnline } = req.body;
  const { id } = req.params; // from Firebase token

  try {
    const updated = await Tutor.findOneAndUpdate(
      { _id: id },
      { online: isOnline },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Tutor not found", success: false });
    }

    res.status(200).json({
      message: `Tutor is now ${isOnline ? "online" : "offline"}`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      success: false,
      error: error.message,
    });
  }
};
export const getLatestTutorOrdersWithZoom = async (req, res) => {
  try {
    const { tutorId } = req.params;


    // Fetch latest 3 orders with zoomLink
    const orders = await Order.find({
      tutorId,
      zoomLink: { $ne: "" }, // Only orders with zoomLink generated
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(3) // Get only 3 orders
      .populate("userId", "name email") // Add student info
      .populate("unitId", "name subject"); // Add unit info

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching tutor orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};
export const getHistory = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const orders = await Order.find({ tutorId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email") // Include student info
      .populate("unitId", "name subject") // Include unit info
      .select("userId unitId amount zoomLink paymentStatus createdAt"); // Fields to include

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching tutor orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};
