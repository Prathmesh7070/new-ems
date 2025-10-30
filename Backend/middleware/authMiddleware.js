import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🔒 Protect Middleware
 * Verifies JWT token and attaches user info to req.user
 */
export const protect = (req, res, next) => {
  try {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    // Attach decoded user info to request object
    req.user = decoded;

    // Continue to next middleware or route
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
