import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emsdb";

export const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected for seeding...");

    // ---- Admin ----
    const adminEmail = "admin@ems.com";
    const adminPassword = "Admin@123";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.username = "SuperAdmin";
      admin.password = hashedAdminPassword;
      admin.role = "admin";
      await admin.save();
      console.log("🔹 Admin updated");
    } else {
      await User.create({ username: "SuperAdmin", email: adminEmail, password: hashedAdminPassword, role: "admin" });
      console.log("✅ Admin created");
    }

    // ---- Employees ----
    const employees = [
      { username: "Arjun", email: "arjun@example.com", password: "123" },
      { username: "Sneha", email: "sneha@example.com", password: "123" },
      { username: "Kishor", email: "kishor@gmail.com", password: "123" },
    ];

    for (const emp of employees) {
      const existingEmp = await User.findOne({ email: emp.email });
      const hashedPassword = await bcrypt.hash(emp.password, 10);
      if (existingEmp) {
        existingEmp.username = emp.username;
        existingEmp.password = hashedPassword;
        existingEmp.role = "employee";
        await existingEmp.save();
        console.log(`🔹 Employee ${emp.username} updated`);
      } else {
        await User.create({ username: emp.username, email: emp.email, password: hashedPassword, role: "employee" });
        console.log(`✅ Employee ${emp.username} created`);
      }
    }

    // ---- Sample tasks ----
    const allEmployees = await User.find({ role: "employee" });
    const sampleTasks = [
      { title: "Fix UI alignment", description: "Update dashboard layout.", category: "Design", status: "new" },
      { title: "Backend API Testing", description: "Test API endpoints.", category: "Development", status: "active" },
      { title: "Prepare Report", description: "Prepare monthly report.", category: "Documentation", status: "completed" },
      { title: "Resolve Bug #45", description: "Fix login issue.", category: "Bug", status: "failed" },
    ];

    for (const emp of allEmployees) {
      for (const t of sampleTasks) {
        const existingTask = await Task.findOne({ title: t.title, assignedTo: emp._id });
        if (!existingTask) {
          await Task.create({ ...t, assignedTo: emp._id, createdBy: emp._id, date: new Date() });
        }
      }
      console.log(`✅ Default tasks ensured for ${emp.username}`);
    }

    console.log("🎉 Database seeding complete!");
  } catch (err) {
    console.error("❌ Database seeding error:", err);
  }
};
