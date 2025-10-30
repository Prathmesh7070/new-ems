import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
