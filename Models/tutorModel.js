// tutorModel.js
import mongoose from "mongoose";

// Define the tutor schema
const tutorSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    skill: { type: String },
    image: { type: String },
    degree: { type: Number },
    accNo: { type: String },
    total: { type: Number, default: 0 },
    online: { type: Boolean, default: false },
    role: { type: String, default: "tutor" },
  },
  { timestamps: true }
);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
