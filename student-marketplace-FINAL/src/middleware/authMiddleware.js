/**
 * File: authMiddleware.js
 * Description: JWT authentication middleware for protecting routes
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */


const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer TOKEN")
    const token = req.headers.authorization?.split(" ")[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    // Verify token with JWT secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );

    // Attach decoded user data to request object
    req.user = decoded;

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
