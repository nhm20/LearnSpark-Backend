import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  }
},{ timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
