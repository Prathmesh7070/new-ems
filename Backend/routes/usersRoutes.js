import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// JWT Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

// GET all employees (Admin Only)
router.get("/employees", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can view employees" });

    const employees = await User.find({ role: "employee" }).select("_id username email role");
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// DELETE employee (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can dismiss employees" });

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid employee ID" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Employee not found" });

    if (user.role === "admin") return res.status(403).json({ message: "Cannot dismiss another admin" });

    await User.findByIdAndDelete(id);
    res.json({ message: "Employee dismissed successfully", id });
  } catch (err) {
    console.error("Error dismissing employee:", err);
    res.status(500).json({ message: "Error dismissing employee", error: err.message });
  }
});

export default router;
