import express from "express";
import multer from "multer";
import fs from "fs";
import Task from "../models/Task.js";
import User from "../models/User.js";
import File from "../models/File.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------------------
// Multer setup
// ---------------------------
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });

// ---------------------------
// Create Task (Admin Only)
// ---------------------------
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can create tasks" });

    const { title, description, category, assignedTo, date } = req.body;

    if (!title || !assignedTo)
      return res
        .status(400)
        .json({ message: "Title and assignedTo are required" });

    const employee = await User.findById(assignedTo);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const newTask = await Task.create({
      title,
      description,
      category,
      assignedTo,
      date: date || new Date(),
      status: "new",
      createdBy: req.user.id,
    });

    res
      .status(201)
      .json({ message: "✅ Task created successfully", task: newTask });
  } catch (err) {
    console.error("Create task error:", err);
    res
      .status(500)
      .json({ message: "Error creating task", error: err.message });
  }
});

// ---------------------------
// Upload file for a task
// ---------------------------
router.post(
  "/upload/:taskId",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });

      if (
        req.user.role === "employee" &&
        task.assignedTo.toString() !== req.user.id
      )
        return res
          .status(403)
          .json({ message: "You cannot upload for this task" });

      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      // Save file metadata in File collection
      const newFile = await File.create({
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: `uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.id,
        task: task._id,
      });

      // Save reference to task
      task.submissionFile = req.file.filename;
      await task.save();

      res.status(201).json({
        message: "✅ File uploaded successfully",
        file: newFile,
        task,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res
        .status(500)
        .json({ message: "Error uploading file", error: err.message });
    }
  }
);

// ---------------------------
// Delete a file (Admin Only)
// ---------------------------
router.delete("/file/:fileId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can delete files" });

    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete file from uploads folder
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    // Delete file record from DB
    await File.findByIdAndDelete(fileId);

    res.json({ message: "✅ File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res
      .status(500)
      .json({ message: "Error deleting file", error: err.message });
  }
});

// ---------------------------
// Get all tasks (Admin or Employee)
// ---------------------------
router.get("/", protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "username email")
        .populate("createdBy", "username email");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate(
        "createdBy",
        "username email"
      );
    }

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

// ---------------------------
// Admin overview (with uploaded files)
// ---------------------------
router.get("/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can view overview" });

    const employees = await User.find({ role: "employee" });

    const overview = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignedTo: emp._id });

        const taskCounts = {
          newTask: tasks.filter((t) => t.status === "new").length,
          active: tasks.filter((t) => t.status === "active").length,
          completed: tasks.filter((t) => t.status === "completed").length,
          failed: tasks.filter((t) => t.status === "failed").length,
        };

        const uploadedFiles = await File.find({
          task: { $in: tasks.map((t) => t._id) },
        });

        return {
          _id: emp._id,
          firstName: emp.username,
          taskCounts,
          uploadedFiles: uploadedFiles.map((f) => ({
            _id: f._id,
            title: f.originalName,
            file: f.filename,
            url: `http://localhost:5000/uploads/${f.filename}`,
          })),
        };
      })
    );

    res.json(overview);
  } catch (err) {
    console.error("Error fetching overview:", err);
    res
      .status(500)
      .json({ message: "Error fetching overview", error: err.message });
  }
});

// ---------------------------
// Update task status
// ---------------------------
router.patch("/update-status/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "active", "completed", "failed"].includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "employee" &&
      task.assignedTo.toString() !== req.user.id
    )
      return res
        .status(403)
        .json({ message: "You cannot update this task" });

    task.status = status;
    await task.save();

    res.json({ message: "✅ Task status updated successfully", task });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({
      message: "Error updating task status",
      error: err.message,
    });
  }
});

export default router;
