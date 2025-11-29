import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  }
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
