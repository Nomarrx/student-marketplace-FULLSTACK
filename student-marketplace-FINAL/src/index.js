/**
 * File: index.js
 * Description: Main server entry point - Express app configuration and startup
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */


require("reflect-metadata"); // Required for TypeORM decorators
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AppDataSource } = require("./config/database");

// Import all route modules
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const locationRoutes = require("./routes/locationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 */

// Enable CORS for cross-origin requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

/**
 * Root route - API health check
 * GET /
 */
app.get("/", (req, res) => {
  res.json({ 
    message: "Student Marketplace API is running!",
    version: "1.0.0",
    status: "operational"
  });
});

/**
 * API Routes Configuration
 * All routes are prefixed with /api
 */

// Authentication routes (register, login, profile, verification)
app.use("/api/auth", authRoutes);

// Listing routes (CRUD operations for marketplace items)
app.use("/api/listings", listingRoutes);

// Message routes (CRUD operations for buyer-seller communication)
app.use("/api/messages", messageRoutes);

// Category routes (lookup table for item categories)
app.use("/api/categories", categoryRoutes);

// Location routes (campus map meetup locations - unique feature)
app.use("/api/locations", locationRoutes);

// Admin routes (user verification, management, statistics)
app.use("/api/admin", adminRoutes);

/**
 * Database Connection and Server Startup
 * Initialize TypeORM connection before starting Express server
 */
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully!");
    console.log(`📊 Connected to: ${process.env.DB_NAME}`);
    
    // Start Express server after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📝 API Endpoints:`);
      console.log(`   - Authentication: http://localhost:${PORT}/api/auth`);
      console.log(`   - Listings: http://localhost:${PORT}/api/listings`);
      console.log(`   - Messages: http://localhost:${PORT}/api/messages`);
      console.log(`   - Categories: http://localhost:${PORT}/api/categories`);
      console.log(`   - Locations: http://localhost:${PORT}/api/locations`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if database connection fails
  });
