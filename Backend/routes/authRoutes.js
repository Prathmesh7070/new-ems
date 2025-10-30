import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// =============================
//  Google OAuth Client Setup
// =============================
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: "1h" }
  );

// =============================
//  SIGNUP ROUTE
// =============================
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase().trim();
    role = role ? role.toLowerCase() : "employee";

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ message: "Server error during signup", error: err.message });
  }
});

// =============================
//  LOGIN ROUTE
// =============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please sign up first." });

    if (!user.password)
      return res
        .status(400)
        .json({ message: "Use Google login for this account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role.toLowerCase(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Server error during login", error: err.message });
  }
});

// =============================
//  GOOGLE LOGIN ROUTE
// =============================
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Google token missing" });

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const username = email.split("@")[0];

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        username,
        email,
        password: "", // empty password for Google accounts
        role: "employee", // default role
      });
    }

    const jwtToken = generateToken(user);

    res.json({
      message: "Google login successful",
      token: jwtToken,
      username: user.username,
      role: user.role.toLowerCase(),
    });
  } catch (err) {
    console.error("Google login error:", err);
    res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
});

export default router;
