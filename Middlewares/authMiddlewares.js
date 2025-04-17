import JWT from "jsonwebtoken";
import User from "../Models/userModel.js";
import Tutor from "../Models/tutorModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decodedToken = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error checking admin ",
    });
  }
};

export const isTutor = async (req, res, next) => {
  try {
    const user = await Tutor.findById(req.user._id);
    if (user.role !== "tutor") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error checking tutor ",
    });
  }
};
