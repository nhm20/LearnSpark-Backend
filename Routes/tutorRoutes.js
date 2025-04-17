import express from "express";
import { isTutor, requireSignIn } from "../Middlewares/authMiddlewares.js";
import {
  getHistory,
  getLatestTutorOrdersWithZoom,
  updateOnlineStatus,
  updateTutorProfile,
} from "../Controllers/tutorController.js";
const router = express.Router();

router.get("/tutor-auth", requireSignIn, isTutor, (req, res) => {
  res.status(200).send({ message: "Admin Authenticated" });
});
router.put("/profile/:id", updateTutorProfile);

router.put("/online-status/:id", updateOnlineStatus);

router.get(
  "/tutor/:tutorId/latest-zoom",
  getLatestTutorOrdersWithZoom
);
router.get("/history/:tutorId", getHistory);
export default router;
