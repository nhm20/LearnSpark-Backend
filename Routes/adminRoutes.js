import express from "express";
import { checkAdmin, registerAdmin } from "../Controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/exists", checkAdmin);

export default router;
