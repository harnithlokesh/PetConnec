import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (verify JWT token)
const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token, return unauthorized
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized",
      details: "No token provided",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Unauthorized",
        details: "User not found",
      });
    }

    // Attach the user to the request object
    req.user = user;
    console.log(`✅ User ${user.id} authenticated successfully`); // Log successful authentication
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        error: "Unauthorized",
        details: "Token expired, please log in again",
      });
    }

    return res.status(401).json({ 
      success: false,
      error: "Unauthorized",
      details: "Invalid or expired token",
    });
  }
};

// Middleware to authorize specific roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        details: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// Middleware for admin-only access
const adminOnly = authorizeRole("admin");

// Middleware for verifier-only access
const verifierOnly = authorizeRole("verifier");

export { protect, adminOnly, authorizeRole, verifierOnly };