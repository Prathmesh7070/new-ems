import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { seedDatabase } from "./dbSeed.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.resolve("uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emsdb";

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB connected successfully!");

    // Only seed in development mode, not in production
    if (process.env.NODE_ENV !== "production") {
      console.log("🌱 Seeding database...");
      await seedDatabase();
    }

    // Start the server
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});
