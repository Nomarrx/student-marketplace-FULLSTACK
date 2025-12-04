/**
 * File: authRoutes.js
 * Description: Routes for user authentication and verification
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { Router } = require("express");
const { register, login, getProfile, updateProfile, changePassword, deleteAccount, verifyStudent, getVerificationStatus } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadStudentID } = require("../middleware/uploadMiddleware");

const router = Router();

/**
 * POST /api/auth/register
 * Public route - Register new user account with student ID upload
 */
router.post("/register", uploadStudentID, register);

/**
 * POST /api/auth/login
 * Public route - Login and receive JWT token
 */
router.post("/login", login);

/**
 * GET /api/auth/profile
 * Protected route - Get current user profile
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * PUT /api/auth/profile
 * Protected route - Update user profile
 */
router.put("/profile", authMiddleware, updateProfile);

/**
 * PUT /api/auth/password
 * Protected route - Change user password
 */
router.put("/password", authMiddleware, changePassword);

/**
 * DELETE /api/auth/account
 * Protected route - Delete user account
 */
router.delete("/account", authMiddleware, deleteAccount);

/**
 * POST /api/auth/verify-student
 * Protected route - Upload and verify student ID
 */
router.post("/verify-student", authMiddleware, uploadStudentID, verifyStudent);

/**
 * GET /api/auth/verification-status
 * Protected route - Check verification status
 */
router.get("/verification-status", authMiddleware, getVerificationStatus);

module.exports = router;
