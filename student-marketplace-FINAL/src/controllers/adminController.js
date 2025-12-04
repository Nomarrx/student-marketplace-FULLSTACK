/**
 * File: adminController.js
 * Description: Controller for admin operations (user verification, management)
 * Author: Darrel Baffour, Divine Nworisa, Harsh Vyas
 * Date: November 2025
 */

const { AppDataSource } = require("../config/database");

/**
 * Get all pending user verifications
 */
const getPendingVerifications = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    
    const pendingUsers = await userRepository.find({
      where: { isVerified: false },
      order: { joinDate: "DESC" },
    });

    res.json({
      success: true,
      data: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error("Get pending verifications error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Verify a user (admin only)
 */
const verifyUser = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const { userId } = req.params;

    const user = await userRepository.findOne({ where: { userID: userId } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    await userRepository.save(user);

    res.json({
      success: true,
      message: "User verified successfully",
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Reject user verification
 */
const rejectUser = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const { userId } = req.params;

    const user = await userRepository.findOne({ where: { userID: userId } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await userRepository.remove(user);

    res.json({
      success: true,
      message: "User rejected and removed",
    });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    
    const users = await userRepository.find({
      order: { joinDate: "DESC" },
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const listingRepository = AppDataSource.getRepository("Listing");

    const totalUsers = await userRepository.count();
    const verifiedUsers = await userRepository.count({ where: { isVerified: true } });
    const pendingUsers = await userRepository.count({ where: { isVerified: false } });
    
    const totalListings = await listingRepository.count();
    const activeListings = await listingRepository.count({ where: { status: "active" } });
    const soldListings = await listingRepository.count({ where: { status: "sold" } });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          pending: pendingUsers,
        },
        listings: {
          total: totalListings,
          active: activeListings,
          sold: soldListings,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  getPendingVerifications,
  verifyUser,
  rejectUser,
  getAllUsers,
  getDashboardStats,
};
