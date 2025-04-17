import express from "express";
import {
  loginController,
  signUpController,
} from "../Controllers/authController.js";
import { isAdmin, requireSignIn } from "../Middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/signup", signUpController);

router.post("/login", loginController);

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ message: "Admin Authenticated" });
});

export default router;
