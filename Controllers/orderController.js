import dotenv from "dotenv";
import Stripe from "stripe";
import Tutor from "../Models/tutorModel.js";
import Order from "../Models/orderModel.js";
import { generateZoomMeeting } from "../Helpers/zoomHelper.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutSessionController = async (req, res) => {
  try {
    const { course, user } = req.body;
    const courseId = course._id;
    const userId = user.user._id;

    if (!courseId || !userId) {
      return res.status(400).json({
        message: "Invalid course or user ID",
        success: false,
      });
    }

    const tutor = await Tutor.findOne({ skill: course.subject, online: true });
    if (!tutor) {
      return res.status(400).json({
        message: "No tutor available",
        success: false,
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: { name: course.name },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ];

    const order = await Order.create({
      userId: userId,
      unitId: courseId,
      tutorId: tutor._id,
      amount: course.price,
      zoomLink: "",
      paymentStatus: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
      success_url: `${process.env.CLIENT_URL}/orders?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/orders?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      metadata: {
        order_id: order._id.toString(),
      },
    });

    // Set timeout to check payment status after session expiration
    setTimeout(async () => {
      try {
        const updatedOrder = await Order.findById(order._id);
        if (updatedOrder.paymentStatus === "pending") {
          const sessionDetails = await stripe.checkout.sessions.retrieve(
            session.id
          );

          if (sessionDetails.payment_status === "unpaid") {
            updatedOrder.paymentStatus = "failed";
            await updatedOrder.save();
          }
        }
      } catch (error) {
        return;
      }
    }, 30 * 60 * 1000); // 30 minutes

    res.status(200).json({
      sessionId: session.id,
      orderId: order._id.toString(),
      success: true,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create checkout session",
      success: false,
    });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const { session_id, order_id } = req.query;

    if (!session_id || !order_id) {
      return res.status(400).json({
        message: "Missing session or order ID",
        success: false,
      });
    }

    const order = await Order.findById(order_id).populate("unitId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If already completed, just return the order
    if (order.paymentStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Order already completed",
        order,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    // Handle different payment statuses
    switch (session.payment_status) {
      case "paid":
        // Only process if not already completed
        if (order.paymentStatus !== "completed") {
          const tutor = await Tutor.findById(order.tutorId);
          if (!tutor) {
            return res.status(404).json({
              success: false,
              message: "Tutor not found",
            });
          }

          const zoomLink = await generateZoomMeeting(
            tutor.email,
            order.unitId.name
          );

          order.zoomLink = zoomLink;
          order.paymentStatus = "completed";
          order.paymentDetails = {
            stripeSessionId: session.id,
            paymentIntentId: session.payment_intent?.id,
            amountPaid: session.amount_total / 100,
            currency: session.currency,
            paymentMethod: session.payment_intent?.payment_method_types?.[0],
          };
          await order.save();
        }

        return res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          order,
        });

      case "unpaid":
        // Payment failed
        if (order.paymentStatus === "pending") {
          order.paymentStatus = "failed";
          await order.save();
        }
        return res.status(400).json({
          success: false,
          message: "Payment failed or not completed",
        });

      default:
        // Still processing
        return res.status(200).json({
          success: false,
          message: "Payment still processing",
          status: session.payment_status,
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const checkOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      status: order.paymentStatus,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking order status",
    });
  }
};

export const manualPaymentCompletion = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("unitId");
    if (!order || order.paymentStatus !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Order not found or already processed",
      });
    }

    const tutor = await Tutor.findById(order.tutorId);
    const zoomLink = await generateZoomMeeting(tutor.email, order.unitId.name);

    order.zoomLink = zoomLink;
    order.paymentStatus = "completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order manually completed",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate({
        path: "unitId",
        select: "name subject classLevel image price",
      })
      .populate({
        path: "tutorId",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      unit: {
        id: order.unitId?._id,
        name: order.unitId?.name,
        subject: order.unitId?.subject,
        classLevel: order.unitId?.classLevel,
        image: order.unitId?.image,
        price: order.unitId?.price,
      },
      tutor: {
        id: order.tutorId?._id,
        name: order.tutorId?.name,
        skill: order.tutorId?.skill,
        degree: order.tutorId?.degree,
      },
      amount: order.amount,
      paymentStatus: order.paymentStatus,
      meetingLink: order.zoomLink,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};
