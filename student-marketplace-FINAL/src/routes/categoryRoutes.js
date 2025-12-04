/**
 * File: categoryRoutes.js
 * Description: Routes for category lookup operations
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */


const { Router } = require("express");
const { getAllCategories, seedCategories } = require("../controllers/categoryController");

// Create Express router instance
const router = Router();

/**
 * GET /api/categories
 * Public route - Get all available categories
 * Used for dropdown/autocomplete in listing forms
 */
router.get("/", getAllCategories);

/**
 * POST /api/categories/seed
 * Public route - Seed default categories
 * Used for initial setup and testing
 * Creates: textbooks, electronics, furniture, clothing, dorm-essentials, sports-equipment, other
 */
router.post("/seed", seedCategories);

module.exports = router;
