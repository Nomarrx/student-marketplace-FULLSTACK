/**
 * File: adminRoutes.js
 * Description: Routes for admin operations
 * Author: Darrel Baffour, Divine Nworisa, Harsh Vyas
 * Date: November 2025
 */

const { Router } = require("express");
const {
  getPendingVerifications,
  verifyUser,
  rejectUser,
  getAllUsers,
  getDashboardStats,
} = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = Router();

// All admin routes require authentication
// Note: Add adminMiddleware when you implement admin role checking

/**
 * GET /api/admin/verifications/pending
 * Get all pending user verifications
 */
router.get("/verifications/pending", authMiddleware, getPendingVerifications);

/**
 * POST /api/admin/verifications/:userId/verify
 * Verify a user
 */
router.post("/verifications/:userId/verify", authMiddleware, verifyUser);

/**
 * POST /api/admin/verifications/:userId/reject
 * Reject a user verification
 */
router.post("/verifications/:userId/reject", authMiddleware, rejectUser);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get("/users", authMiddleware, getAllUsers);

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics
 */
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

module.exports = router;
