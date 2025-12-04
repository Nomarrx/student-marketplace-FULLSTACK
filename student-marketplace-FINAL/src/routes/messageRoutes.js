/**
 * File: messageRoutes.js
 * Description: Routes for messaging system (CRUD operations)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */


const { Router } = require("express");
const {
  sendMessage,
  getMyMessages,
  getConversations,
  getConversation,
  getChatMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Create Express router instance
const router = Router();

/**
 * POST /api/messages
 * Protected route - Send a message about a listing
 * Requires valid JWT token
 */
router.post("/", authMiddleware, sendMessage);

/**
 * GET /api/messages
 * Protected route - Get all messages for current user (inbox)
 * Includes both sent and received messages
 * Requires valid JWT token
 */
router.get("/", authMiddleware, getMyMessages);

/**
 * GET /api/messages/conversations
 * Protected route - Get all conversations for current user
 * Groups messages by listing and other user
 * Requires valid JWT token
 */
router.get("/conversations", authMiddleware, getConversations);

/**
 * GET /api/messages/:listingId/:otherUserId
 * Protected route - Get chat messages between current user and another user for a listing
 * Requires valid JWT token
 */
router.get("/:listingId/:otherUserId", authMiddleware, getChatMessages);

/**
 * GET /api/messages/conversation/:listingId
 * Protected route - Get all messages for a specific listing
 * Shows conversation between buyer and seller
 * Requires valid JWT token
 */
router.get("/conversation/:listingId", authMiddleware, getConversation);

/**
 * PUT /api/messages/:id/read
 * Protected route - Mark message as read
 * Only receiver can mark as read
 * Requires valid JWT token
 */
router.put("/:id/read", authMiddleware, markAsRead);

/**
 * DELETE /api/messages/:id
 * Protected route - Delete message
 * Only sender can delete their own message
 * Requires valid JWT token
 */
router.delete("/:id", authMiddleware, deleteMessage);

module.exports = router;
