import express from "express";
import Brand from "../models/brand.js";
import Bike from "../models/bike.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Get all brands with their aggregated stats
router.get("/", authMiddleware(), async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    
    // Get aggregated stats for each brand
    const brandsWithStats = await Promise.all(
      brands.map(async (brand) => {
        const stats = await Bike.aggregate([
          { $match: { brand: brand.name } },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: 1 },
              totalAmount: { $sum: "$price" }
            }
          }
        ]);
        
        return {
          _id: brand._id,
          name: brand.name,
          totalQuantity: stats[0]?.totalQuantity || 0,
          totalAmount: stats[0]?.totalAmount || 0,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt
        };
      })
    );
    
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
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    
    const brand = new Brand({ name });
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
    const oldBrand = await Brand.findById(req.params.id);
    if (!oldBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    // Update all bikes with the old brand name to the new brand name
    await Bike.updateMany({ brand: oldBrand.name }, { brand: name });
    
    const brand = await Brand.findByIdAndUpdate(
      req.params.id, 
      { name }, 
      { new: true }
    );
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bikes by brand name
router.get("/:brandName/bikes", authMiddleware(), async (req, res) => {
  try {
    const bikes = await Bike.find({ brand: req.params.brandName });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get brand stats by name
router.get("/:brandName/stats", authMiddleware(), async (req, res) => {
  try {
    const stats = await Bike.aggregate([
      { $match: { brand: req.params.brandName } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: 1 },
          totalAmount: { $sum: "$price" }
        }
      }
    ]);
    
    res.json({
      brandName: req.params.brandName,
      totalQuantity: stats[0]?.totalQuantity || 0,
      totalAmount: stats[0]?.totalAmount || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
