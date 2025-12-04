/**
 * File: listingRoutes.js
 * Description: Routes for marketplace listings
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { Router } = require("express");
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/listingController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadListingImages } = require("../middleware/uploadMiddleware");

const router = Router();

/**
 * POST /api/listings
 * Protected route - Create new listing with images
 */
router.post("/", authMiddleware, uploadListingImages, createListing);

/**
 * GET /api/listings
 * Public route - Get all active listings with filters
 */
router.get("/", getAllListings);

/**
 * GET /api/listings/user
 * Protected route - Get current user's listings
 */
router.get("/user", authMiddleware, getMyListings);

/**
 * GET /api/listings/:id
 * Public route - Get single listing by ID
 */
router.get("/:id", getListingById);

/**
 * PUT /api/listings/:id
 * Protected route - Update listing
 */
router.put("/:id", authMiddleware, uploadListingImages, updateListing);

/**
 * DELETE /api/listings/:id
 * Protected route - Delete listing
 */
router.delete("/:id", authMiddleware, deleteListing);

/**
 * PATCH /api/listings/:id/sold
 * Protected route - Mark listing as sold
 * TODO: Implement markAsSold function in controller
 */
// router.patch("/:id/sold", authMiddleware, markAsSold);

module.exports = router;
