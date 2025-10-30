import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["new", "active", "completed", "failed"], // allowed statuses
    default: "new",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who created the task
  submissionFile: { type: String }, // optional file uploaded by employee
});

export default mongoose.model("Task", taskSchema);
