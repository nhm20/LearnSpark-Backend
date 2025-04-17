import admin from "../Config/fireBaseConfig.js";
import User from "../Models/userModel.js";
import { generateJWTtoken } from "../Helpers/authHelper.js";
import Tutor from "../Models/tutorModel.js";

// 🔸 Sign Up
export const signUpController = async (req, res) => {
  try {
    const { idToken, name, role } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    let existing = null;

    if (role === "user") existing = await User.findOne({ uid });
    else if (role === "tutor") existing = await Tutor.findOne({ uid });

    if (existing) {
      return res
        .status(400)
        .json({ message: "User already exists", error: error.message });
    }
    let newUser;
    if (role === "user") {
      newUser = await User.create({ uid, email, name, role });
    } else if (role === "tutor") {
      newUser = await Tutor.create({ uid, email, name, role });
    }

    const token = generateJWTtoken(newUser._id, role);

    res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    const user =
      (await User.findOne({ uid })) || (await Tutor.findOne({ uid }));

    if (!user) {
      return res
        .status(404)
        .json({ error: "No user found. Please sign up first." });
    }

    const token = generateJWTtoken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Login failed. Please try again later.",
    });
  }
};
