import express from "express";
import Bike from "../models/bike.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Add new bike (admin/manager only)
router.post("/", authMiddleware(["admin", "manager"]), async (req, res) => {
  const bike = new Bike(req.body);
  await bike.save();
  res.json(bike);
});

// Get all bikes
router.get("/", authMiddleware(), async (req, res) => {
  const bikes = await Bike.find();
  res.json(bikes);
});

// Update bike
router.put("/:id", authMiddleware(["admin", "manager"]), async (req, res) => {
  const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bike);
});

// Delete bike
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
 try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);
    if (!deletedBike) return res.status(404).json({ message: "Bike not found" });
    res.json({ message: "Bike deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
  
});

export default router;