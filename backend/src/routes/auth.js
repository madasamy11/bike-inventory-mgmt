import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
     console.log("📩 Incoming signup request:", req.body);
try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const userData = new user({ name, email, passwordHash: hashed, role });
    await userData.save();

    res.json({ message: "User created" });
  } catch (err) {
    console.error("❌ Signup failed:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Incoming login request for:", req.body);
  const userData = await user.findOne({ email });
  if (!userData) return res.status(400).json({ message: "Invalid credentials" });
  console.log("📩 Mongo response:", userData);

  const valid = await bcrypt.compare(password, userData.passwordHash);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: userData._id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

  res.json({ token, role: userData.role, name: userData.name, email: userData.email });
});

export default router;