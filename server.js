import dotenv from "dotenv";
import express from "express";
import connectDB from "./Config/database.js";
import unitRoutes from "./Routes/unitRoutes.js";
import tutorRoutes from "./Routes/tutorRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import cors from "cors";
dotenv.config();
connectDB();

const app = express();

// CORS and Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/orders", orderRoutes);

app.use("/", (req, res) => {
  res.json({ message: "Welcome to the backend API" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
