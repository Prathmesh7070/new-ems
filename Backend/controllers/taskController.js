// controllers/taskController.js
import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, category, assignedTo, date } = req.body;

    if (!assignedTo) return res.status(400).json({ message: "Assigned user missing" });

    const user = await User.findById(assignedTo);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = await Task.create({
      title,
      description,
      category,
      assignedTo,
      date,
      createdBy: req.user.id,
      status: "new",
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// ✅ Fetch tasks for logged-in employee
export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ assignedTo: userId });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// ✅ Overview for admin (count by status)
export const getOverview = async (req, res) => {
  try {
    const counts = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(counts);
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ message: "Error fetching overview" });
  }
};
