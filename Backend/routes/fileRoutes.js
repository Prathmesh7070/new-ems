// routes/fileRoutes.js
import express from "express";
import File from "../models/File.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// 📂 GET ALL UPLOADED FILES (Admin Only)
// ==========================
router.get("/", protect, async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view files" });
    }

    // Fetch all files sorted by newest first
    const files = await File.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "username email") // Include uploader info
      .populate("task", "title status"); // Optional: include task info

    // Return files
    res.status(200).json({
      message: "✅ Files fetched successfully",
      count: files.length,
      files,
    });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({
      message: "Error fetching files",
      error: err.message,
    });
  }
});

// ==========================
// 🔍 GET FILE BY ID (Optional)
// ==========================
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id)
      .populate("uploadedBy", "username email")
      .populate("task", "title status");

    if (!file) return res.status(404).json({ message: "File not found" });

    // Only admin or uploader can view
    if (req.user.role !== "admin" && req.user.id !== file.uploadedBy._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ message: "✅ File fetched successfully", file });
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ message: "Error fetching file", error: err.message });
  }
});

export default router;
