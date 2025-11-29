import express from "express";
import Brand from "../models/brand.js";
import Bike from "../models/bike.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Helper function to escape special regex characters to prevent ReDoS attacks
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Get all brands with their aggregated stats using $lookup for better performance
router.get("/", authMiddleware(), async (req, res) => {
  try {
    const brandsWithStats = await Brand.aggregate([
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "bikes",
          localField: "name",
          foreignField: "brand",
          as: "bikes"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuantity: { $size: "$bikes" },
          totalAmount: {
            $cond: [
              { $gt: [{ $size: "$bikes" }, 0] },
              { $sum: "$bikes.price" },
              0
            ]
          },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    
    res.json(brandsWithStats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get overall summary (total brands, total quantity, total amount)
router.get("/summary", authMiddleware(), async (req, res) => {
  try {
    const totalBrands = await Brand.countDocuments();
    const stats = await Bike.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: 1 },
          totalAmount: { $sum: "$price" }
        }
      }
    ]);
    
    res.json({
      totalBrands,
      totalQuantity: stats[0]?.totalQuantity || 0,
      totalAmount: stats[0]?.totalAmount || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new brand (admin/manager only)
router.post("/", authMiddleware(["admin", "manager"]), async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate brand name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Brand name is required" });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ message: "Brand name is too long" });
    }
    const trimmedName = name.trim();
    
    // Case-insensitive duplicate check
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') }
    });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    
    const brand = new Brand({ name: trimmedName });
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update brand (admin/manager only)
router.put("/:id", authMiddleware(["admin", "manager"]), async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate brand name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Brand name is required" });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ message: "Brand name is too long" });
    }
    const trimmedName = name.trim();
    
    const oldBrand = await Brand.findById(req.params.id);
    if (!oldBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    // Case-insensitive duplicate check (excluding current brand)
    if (trimmedName.toLowerCase() !== oldBrand.name.toLowerCase()) {
      const existingBrand = await Brand.findOne({ 
        name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') }
      });
      if (existingBrand) {
        return res.status(400).json({ message: "Brand name already exists" });
      }
    }
    
    // Update all bikes with the old brand name to the new brand name
    const updateResult = await Bike.updateMany({ brand: oldBrand.name }, { brand: trimmedName });
    
    const brand = await Brand.findByIdAndUpdate(
      req.params.id, 
      { name: trimmedName }, 
      { new: true }
    );
    res.json({ brand, bikesUpdated: updateResult.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bikes by brand name
router.get("/:brandName/bikes", authMiddleware(), async (req, res) => {
  try {
    const brandName = decodeURIComponent(req.params.brandName);
    const bikes = await Bike.find({ brand: brandName });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get brand stats by name
router.get("/:brandName/stats", authMiddleware(), async (req, res) => {
  try {
    const brandName = decodeURIComponent(req.params.brandName);
    const stats = await Bike.aggregate([
      { $match: { brand: brandName } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: 1 },
          totalAmount: { $sum: "$price" }
        }
      }
    ]);
    
    res.json({
      brandName,
      totalQuantity: stats[0]?.totalQuantity || 0,
      totalAmount: stats[0]?.totalAmount || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
