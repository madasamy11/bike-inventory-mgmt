import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["admin", "manager", "salesperson", "viewer"], default: "viewer" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
