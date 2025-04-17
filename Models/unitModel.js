import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    classLevel: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true, 
    },
    timeLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Unit = mongoose.model("Unit", unitSchema);
export default Unit;