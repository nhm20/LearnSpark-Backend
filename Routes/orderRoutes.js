import express from "express";
import { checkOrderStatus, checkoutSessionController, getOrdersByUserId, manualPaymentCompletion, verifyPaymentController } from "../Controllers/orderController.js";
// import { isAuthenticated, isAdmin } from "../Middlewares/authMiddlewares.js";

const router = express.Router();
// router.get("/", isAuthenticated, isAdmin, getAllOrders);
// router.get("/:id", isAuthenticated, getOrderById);
// router.post("/", isAuthenticated, createOrder);
// router.put("/:id", isAuthenticated, isAdmin, updateOrderStatus);
// router.delete("/:id", isAuthenticated, isAdmin, deleteOrder);

router.post("/create-checkout-session", checkoutSessionController);

router.get("/verify-payment", verifyPaymentController);

router.get("/status/:order_id", checkOrderStatus);

router.get('/manual-payment-complete',manualPaymentCompletion)

router.get('/:userId',getOrdersByUserId)
export default router;
