/**
 * File: categoryController.js
 * Description: Controller for category lookup operations
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { AppDataSource } = require("../config/database");

/**
 * Get all available categories
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response with array of categories
 */
const getAllCategories = async (req, res) => {
  try {
    // Get Category repository
    const categoryRepository = AppDataSource.getRepository("Category");
    
    // Fetch all categories from database
    const categories = await categoryRepository.find();

    // Return categories array
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Seed default categories into database
 * Used for initial setup and testing
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response with seeded categories
 */
const seedCategories = async (req, res) => {
  try {
    // Get Category repository
    const categoryRepository = AppDataSource.getRepository("Category");
    
    // Define default categories for the marketplace
    const defaultCategories = [
      { name: "textbooks", displayName: "Textbooks", icon: "book" },
      { name: "electronics", displayName: "Electronics", icon: "laptop" },
      { name: "furniture", displayName: "Furniture", icon: "chair" },
      { name: "clothing", displayName: "Clothing", icon: "shirt" },
      { name: "dorm-essentials", displayName: "Dorm Essentials", icon: "home" },
      { name: "sports-equipment", displayName: "Sports Equipment", icon: "ball" },
      { name: "other", displayName: "Other", icon: "box" },
    ];

    // Loop through each category and create if doesn't exist
    for (const cat of defaultCategories) {
      // Check if category already exists
      const exists = await categoryRepository.findOne({ where: { name: cat.name } });
      
      if (!exists) {
        // Create new category if it doesn't exist
        const category = categoryRepository.create(cat);
        await categoryRepository.save(category);
      }
    }

    // Fetch all categories to return
    const allCategories = await categoryRepository.find();

    // Return success response with all categories
    res.status(200).json({
      success: true,
      message: "Categories seeded successfully",
      categories: allCategories,
    });
  } catch (error) {
    console.error("Seed categories error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { getAllCategories, seedCategories };
