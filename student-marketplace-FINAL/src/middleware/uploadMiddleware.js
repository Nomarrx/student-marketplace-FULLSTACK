/**
 * File: uploadMiddleware.js
 * Description: Multer configuration for handling file uploads
 * Author: Darrel Baffour, Divine Nworisa, Harsh Vyas
 * Date: November 2025
 */

const multer = require("multer");
const path = require("path");

// Storage configuration for student ID uploads
const studentIDStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/student-ids/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "student-id-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage configuration for listing images
const listingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/listings/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "listing-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Multer instances
const uploadStudentID = multer({
  storage: studentIDStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter,
}).single("studentIDImage");

const uploadListingImages = multer({
  storage: listingStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: imageFilter,
}).array("images", 5); // Max 5 images

const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter,
}).single("profilePicture");

module.exports = {
  uploadStudentID,
  uploadListingImages,
  uploadProfilePicture,
};
