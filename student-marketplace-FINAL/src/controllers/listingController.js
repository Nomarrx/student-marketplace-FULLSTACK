/**
 * File: listingController.js
 * Description: Controller handling all listing operations (CRUD)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { AppDataSource } = require("../config/database");

/**
 * Create a new listing
 * @param {Object} req - Express request containing listing data
 * @param {Object} res - Express response
 * @returns JSON response with created listing
 */
const createListing = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Get user ID from authenticated token
    const userId = req.user?.userId;
    
    // Extract listing data from request body
    const { title, description, category, price, condition, campusLocation } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !condition) {
      return res.status(400).json({
        success: false,
        error: "Title, description, category, price, and condition are required",
      });
    }

    // Get uploaded image paths from multer
    // Convert Windows backslashes to forward slashes for URLs
    const imagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];

    // Create new listing instance
    const listing = listingRepository.create({
      sellerID: userId,
      title,
      description,
      category,
      price: parseFloat(price),
      condition,
      location: campusLocation || "Regina",
      imageUrls: imagePaths,
      status: "available",
    });

    // Save listing to database
    await listingRepository.save(listing);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error",
      message: error.message 
    });
  }
};

/**
 * Get all listings with optional filters
 * @param {Object} req - Express request with optional query parameters
 * @param {Object} res - Express response
 * @returns JSON response with array of listings
 */
const getAllListings = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Extract filter parameters from query string
    const { category, minPrice, maxPrice, condition, status, search } = req.query;

    // Build query with QueryBuilder for dynamic filtering
    let query = listingRepository.createQueryBuilder("listing")
      .leftJoinAndSelect("listing.seller", "seller");

    // Apply category filter if provided
    if (category) {
      query = query.andWhere("listing.category = :category", { category });
    }

    // Apply minimum price filter if provided
    if (minPrice) {
      query = query.andWhere("listing.price >= :minPrice", { minPrice });
    }

    // Apply maximum price filter if provided
    if (maxPrice) {
      query = query.andWhere("listing.price <= :maxPrice", { maxPrice });
    }

    // Apply condition filter if provided
    if (condition) {
      query = query.andWhere("listing.condition = :condition", { condition });
    }

    // Apply status filter or default to available listings only
    if (status) {
      query = query.andWhere("listing.status = :status", { status });
    } else {
      query = query.andWhere("listing.status = :status", { status: "available" });
    }

    // Apply search filter if provided (searches title and description)
    if (search) {
      query = query.andWhere(
        "(listing.title LIKE :search OR listing.description LIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Execute query and sort by most recent first
    const listings = await query
      .orderBy("listing.createdAt", "DESC")
      .getMany();

    // Return listings array
    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get single listing by ID
 * @param {Object} req - Express request with listing ID in params
 * @param {Object} res - Express response
 * @returns JSON response with listing details
 */
const getListingById = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Extract listing ID from URL parameters
    const { id } = req.params;
    
    // Get user ID if authenticated (optional)
    const userId = req.user?.userId;
    
    console.log('=== VIEW COUNT DEBUG ===');
    console.log('Viewer userId:', userId);
    console.log('Listing sellerID will be checked after fetching');

    // Find listing with seller information
    const listing = await listingRepository.findOne({
      where: { listingID: parseInt(id) },
      relations: ["seller"],
    });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    console.log('Listing sellerID:', listing.sellerID);
    console.log('Is viewer the owner?', userId === listing.sellerID);

    // Increment view count ONLY if viewer is NOT the owner
    if (!userId || userId !== listing.sellerID) {
      console.log('✅ Incrementing view count (viewer is NOT owner)');
      listing.viewCount += 1;
      await listingRepository.save(listing);
    } else {
      console.log('❌ NOT incrementing view count (viewer IS owner)');
    }

    // Return listing details
    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Update an existing listing
 * @param {Object} req - Express request with listing ID and update data
 * @param {Object} res - Express response
 * @returns JSON response with updated listing
 */
const updateListing = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Get authenticated user ID
    const userId = req.user?.userId;
    
    // Extract listing ID from URL parameters
    const { id } = req.params;
    
    // Extract update data from request body
    const { title, description, category, price, condition, campusLocation, status, existingImages } = req.body;

    // Find existing listing
    const listing = await listingRepository.findOne({
      where: { listingID: parseInt(id) },
    });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Verify ownership - only owner can update
    if (listing.sellerID !== userId) {
      return res.status(403).json({ success: false, error: "You can only update your own listings" });
    }

    // Update ONLY the fields that are provided
    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (category !== undefined) listing.category = category;
    if (price !== undefined) listing.price = parseFloat(price);
    if (condition !== undefined) listing.condition = condition;
    if (campusLocation !== undefined) listing.location = campusLocation;
    if (status !== undefined) listing.status = status;

    // ONLY update images if we're actually editing images (from edit page)
    // This prevents "Mark as Sold" from clearing images
    if (existingImages !== undefined || (req.files && req.files.length > 0)) {
      let finalImages = [];

      // Parse existing images if provided
      if (existingImages) {
        try {
          finalImages = JSON.parse(existingImages);
        } catch (e) {
          console.error('Failed to parse existingImages:', e);
          // If parsing fails, keep current images
          finalImages = listing.imageUrls || [];
        }
      }

      // Add new uploaded images
      if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => file.path.replace(/\\/g, '/'));
        finalImages = [...finalImages, ...newImagePaths];
      }

      listing.imageUrls = finalImages;
    }
    // Otherwise, imageUrls stays completely unchanged

    // Save updated listing
    await listingRepository.save(listing);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error",
      message: error.message 
    });
  }
};

/**
 * Delete a listing
 * @param {Object} req - Express request with listing ID
 * @param {Object} res - Express response
 * @returns JSON response confirming deletion
 */
const deleteListing = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Get authenticated user ID
    const userId = req.user?.userId;
    
    // Extract listing ID from URL parameters
    const { id } = req.params;

    // Find listing to delete
    const listing = await listingRepository.findOne({
      where: { listingID: parseInt(id) },
    });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Verify ownership - only owner can delete
    if (listing.sellerID !== userId) {
      return res.status(403).json({ success: false, error: "You can only delete your own listings" });
    }

    // Remove listing from database
    await listingRepository.remove(listing);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all listings for the authenticated user
 * @param {Object} req - Express request with authenticated user
 * @param {Object} res - Express response
 * @returns JSON response with user's listings
 */
const getMyListings = async (req, res) => {
  try {
    // Get Listing repository
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Get authenticated user ID
    const userId = req.user?.userId;

    // Find all listings created by this user
    const listings = await listingRepository.find({
      where: { sellerID: userId },
      order: { createdAt: "DESC" }, // Most recent first
    });

    // Return user's listings
    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get my listings error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
};
