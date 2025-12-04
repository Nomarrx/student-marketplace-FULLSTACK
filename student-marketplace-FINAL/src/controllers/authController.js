/**
 * File: authController.js
 * Description: Controller handling user authentication, registration, and verification
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/database");

/**
 * Register a new user account
 * @param {Object} req - Express request containing user registration data
 * @param {Object} res - Express response
 * @returns JSON response with success status and user data
 */
const register = async (req, res) => {
  try {
    // Get User repository
    const userRepository = AppDataSource.getRepository("User");
    
    // Extract registration data from request body
    const { email, password, fullName, phoneNumber, campusLocation } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: "Email, password, and full name are required",
      });
    }

    // Validate email is @saskpolytech.ca
    if (!email.endsWith("@saskpolytech.ca")) {
      return res.status(400).json({
        success: false,
        error: "Email must be a @saskpolytech.ca address",
      });
    }

    // Check if user already exists with this email
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Hash password for security 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get uploaded file path if exists
    const studentIDUrl = req.file ? req.file.path : null;

    // Create new user instance
    const user = userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      campusLocation,
      studentIDUrl,
    });

    // Save user to database
    await userRepository.save(user);

    // Return success response without password
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Login user and return JWT token
 * @param {Object} req - Express request containing login credentials
 * @param {Object} res - Express response
 * @returns JSON response with JWT token and user data
 */
const login = async (req, res) => {
  try {
    // Get User repository
    const userRepository = AppDataSource.getRepository("User");
    
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      { userId: user.userID, email: user.email },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      token,
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request with authenticated user
 * @param {Object} res - Express response
 * @returns JSON response with user profile data
 */
const getProfile = async (req, res) => {
  try {
    // Get User repository
    const userRepository = AppDataSource.getRepository("User");
    
    // Get user ID from JWT token (set by auth middleware)
    const userId = req.user?.userId;

    // Find user in database
    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Return user profile without password
    res.status(200).json({
      success: true,
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        campusLocation: user.campusLocation,
        isVerified: user.isVerified,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Upload student ID for verification
 * @param {Object} req - Express request with student ID image URL
 * @param {Object} res - Express response
 * @returns JSON response with verification status
 */
const verifyStudent = async (req, res) => {
  try {
    // Get User repository
    const userRepository = AppDataSource.getRepository("User");
    
    // Get user ID from JWT token
    const userId = req.user?.userId;
    const { studentIDUrl } = req.body;

    // Validate student ID URL provided
    if (!studentIDUrl) {
      return res.status(400).json({
        success: false,
        error: "Student ID image URL is required",
      });
    }

    // Find user in database
    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Save student ID URL and mark as verified
    // Note: In production, admin would review before auto-verifying
    user.studentIDUrl = studentIDUrl;
    user.isVerified = true;
    user.verifiedAt = new Date();

    // Update user in database
    await userRepository.save(user);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Student ID uploaded and verified successfully",
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Verify student error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get user's verification status
 * @param {Object} req - Express request with authenticated user
 * @param {Object} res - Express response
 * @returns JSON response with verification details
 */
const getVerificationStatus = async (req, res) => {
  try {
    // Get User repository
    const userRepository = AppDataSource.getRepository("User");
    
    // Get user ID from JWT token
    const userId = req.user?.userId;

    // Find user in database
    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Return verification status
    res.status(200).json({
      success: true,
      verification: {
        isVerified: user.isVerified,
        studentIDUrl: user.studentIDUrl,
        verifiedAt: user.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request with updated profile data
 * @param {Object} res - Express response
 * @returns JSON response with updated user data
 */
const updateProfile = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const userId = req.user?.userId;

    const { fullName, phone } = req.body;

    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phoneNumber = phone;

    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        phone: user.phoneNumber,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Change user password
 * @param {Object} req - Express request with current and new password
 * @param {Object} res - Express response
 * @returns JSON response confirming password change
 */
const changePassword = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const userId = req.user?.userId;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required"
      });
    }

    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;

    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response confirming deletion
 */
const deleteAccount = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const listingRepository = AppDataSource.getRepository("Listing");
    const messageRepository = AppDataSource.getRepository("Message");
    const userId = req.user?.userId;

    const user = await userRepository.findOne({ where: { userID: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Delete user's listings
    await listingRepository.delete({ sellerID: userId });

    // Delete user's messages
    await messageRepository.delete({ senderID: userId });
    await messageRepository.delete({ receiverID: userId });

    // Delete user account
    await userRepository.remove(user);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, deleteAccount, verifyStudent, getVerificationStatus };
