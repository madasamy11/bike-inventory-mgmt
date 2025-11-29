import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  brand: String,
  model: String,
  licensePlate: { type: String, unique: true },
  year: Number,
  price: Number,
  condition: String,
  status: {
    type: String,
    enum: ["Available", "Sold"],
    default: "Available",
    set: v => v === "" ? undefined : v
  },
  images: [String],
  inDate: Date,
  outDate: Date,
  notes: String,
  closed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Bike", bikeSchema);
