/**
 * File: locationController.js
 * Description: Controller for campus meetup location operations (unique feature)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { AppDataSource } = require("../config/database");

/**
 * Get all verified meetup locations
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response with array of campus locations
 */
const getAllLocations = async (req, res) => {
  try {
    // Get MeetupLocation repository
    const locationRepository = AppDataSource.getRepository("MeetupLocation");
    
    // Fetch only verified safe locations
    const locations = await locationRepository.find({
      where: { isVerified: true },
    });

    // Return locations array
    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get single location by ID
 * @param {Object} req - Express request with location ID in params
 * @param {Object} res - Express response
 * @returns JSON response with location details
 */
const getLocationById = async (req, res) => {
  try {
    // Get MeetupLocation repository
    const locationRepository = AppDataSource.getRepository("MeetupLocation");
    
    // Extract location ID from URL parameters
    const { id } = req.params;

    // Find location in database
    const location = await locationRepository.findOne({
      where: { locationID: parseInt(id) },
    });

    // Check if location exists
    if (!location) {
      return res.status(404).json({ success: false, error: "Location not found" });
    }

    // Return location details
    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Seed default Saskatchewan Polytechnic Regina campus locations
 * Unique Feature: Real campus locations with GPS coordinates for map integration
 * Used for initial setup and testing
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response with seeded locations
 */
const seedLocations = async (req, res) => {
  try {
    // Get MeetupLocation repository
    const locationRepository = AppDataSource.getRepository("MeetupLocation");
    
    // Define real Saskatchewan Polytechnic Regina campus locations
    // Address: 4500 Wascana Parkway, Regina, SK S4S 5X1
    const defaultLocations = [
      {
        name: "Library Main Entrance",
        buildingName: "Saskatchewan Polytechnic Library",
        coordinates: { latitude: 50.4285, longitude: -104.6318 },
        description: "Main entrance of campus library at 4500 Wascana Parkway, safe and monitored area",
        isVerified: true,
      },
      {
        name: "Student Services Centre",
        buildingName: "Student Services",
        coordinates: { latitude: 50.4287, longitude: -104.6315 },
        description: "Student services building, high traffic area with security",
        isVerified: true,
      },
      {
        name: "Cafeteria Main Entrance",
        buildingName: "Campus Cafeteria",
        coordinates: { latitude: 50.4283, longitude: -104.6320 },
        description: "Main cafeteria entrance, busy during lunch hours, safe meetup spot",
        isVerified: true,
      },
      {
        name: "Campus Security Office",
        buildingName: "Security & Safety Services",
        coordinates: { latitude: 50.4288, longitude: -104.6312 },
        description: "Most secure location on campus - security office at 4500 Wascana Parkway",
        isVerified: true,
      },
      {
        name: "Main Building Lobby",
        buildingName: "Main Academic Building",
        coordinates: { latitude: 50.4286, longitude: -104.6316 },
        description: "Main lobby with reception desk, monitored entrance",
        isVerified: true,
      },
      {
        name: "Parkade Entrance",
        buildingName: "Campus Parking",
        coordinates: { latitude: 50.4284, longitude: -104.6322 },
        description: "Well-lit parking area entrance near Wascana Parkway",
        isVerified: true,
      },
    ];

    // Loop through each location and create if doesn't exist
    for (const loc of defaultLocations) {
      // Check if location already exists
      const exists = await locationRepository.findOne({ where: { name: loc.name } });
      
      if (!exists) {
        // Create new location if it doesn't exist
        const location = locationRepository.create(loc);
        await locationRepository.save(location);
      }
    }

    // Fetch all locations to return
    const allLocations = await locationRepository.find();

    // Return success response with all locations
    res.status(200).json({
      success: true,
      message: "Saskatchewan Polytechnic Regina campus locations seeded successfully",
      locations: allLocations,
    });
  } catch (error) {
    console.error("Seed locations error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { getAllLocations, getLocationById, seedLocations };
