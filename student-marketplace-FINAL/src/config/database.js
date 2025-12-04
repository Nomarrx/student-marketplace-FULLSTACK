/**
 * File: database.js
 * Description: TypeORM database configuration and connection setup
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { DataSource } = require("typeorm");
const { User } = require("../entities/User");
const { Listing } = require("../entities/Listing");
const { Message } = require("../entities/Message");
const { Category } = require("../entities/Category");
const { MeetupLocation } = require("../entities/MeetupLocation");

/**
 * Database connection configuration
 * Uses environment variables for credentials
 */
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "student_marketplace",
  // Auto-create tables 
  synchronize: true, 
  logging: false, 
   // All entity classes
  entities: [User, Listing, Message, Category, MeetupLocation],
});

module.exports = { AppDataSource };
