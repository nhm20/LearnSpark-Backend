import express from "express";
import { getOrders, getTutors, getUsers } from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/tutors", getTutors); 
router.get("/orders", getOrders);
export default router;
