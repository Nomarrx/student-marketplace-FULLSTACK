/**
 * File: locationRoutes.js
 * Description: Routes for campus meetup location operations (unique feature)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */


const { Router } = require("express");
const { getAllLocations, getLocationById, seedLocations } = require("../controllers/locationController");

// Create Express router instance
const router = Router();

/**
 * GET /api/locations
 * Public route - Get all verified campus meetup locations
 * Unique Feature: Returns real Saskatchewan Polytechnic Regina locations with GPS coordinates
 * Used for campus map integration
 */
router.get("/", getAllLocations);

/**
 * GET /api/locations/:id
 * Public route - Get single location details by ID
 * Returns location with coordinates for map display
 */
router.get("/:id", getLocationById);

/**
 * POST /api/locations/seed
 * Public route - Seed default SaskPolytech Regina campus locations
 * Used for initial setup and testing
 * Creates 6 verified safe meetup spots: Library, Student Services, Cafeteria, Security Office, Main Lobby, Parkade
 * Address: 4500 Wascana Parkway, Regina, SK S4S 5X1
 */
router.post("/seed", seedLocations);

module.exports = router;
