/**
 * File: messageController.js
 * Description: Controller handling messaging between buyers and sellers (CRUD)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { AppDataSource } = require("../config/database");

/**
 * Send a message about a listing
 * @param {Object} req - Express request containing message data
 * @param {Object} res - Express response
 * @returns JSON response with created message
 */
const sendMessage = async (req, res) => {
  try {
    // Get repository instances
    const messageRepository = AppDataSource.getRepository("Message");
    const listingRepository = AppDataSource.getRepository("Listing");
    
    // Get authenticated user ID (sender)
    const userId = req.user?.userId;
    
    // Extract message data from request body
    const { listingID, receiverID, messageText } = req.body;

    // Validate required fields
    if (!listingID || !receiverID || !messageText) {
      return res.status(400).json({
        success: false,
        error: "Listing ID, receiver ID, and message text are required",
      });
    }

    // Verify that the listing exists
    const listing = await listingRepository.findOne({
      where: { listingID: parseInt(listingID) },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Create new message instance
    const message = messageRepository.create({
      listingID: parseInt(listingID),
      senderID: userId,
      receiverID: parseInt(receiverID),
      messageText,
    });

    // Save message to database
    await messageRepository.save(message);

    // Return success response with message in expected format
    res.status(201).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all messages for current user (inbox)
 * @param {Object} req - Express request with authenticated user
 * @param {Object} res - Express response
 * @returns JSON response with array of messages
 */
const getMyMessages = async (req, res) => {
  try {
    // Get Message repository
    const messageRepository = AppDataSource.getRepository("Message");
    
    // Get authenticated user ID
    const userId = req.user?.userId;

    // Find all messages where user is sender or receiver
    const messages = await messageRepository.find({
      where: [
        { senderID: userId },    // Messages user sent
        { receiverID: userId }   // Messages user received
      ],
      relations: ["sender", "receiver", "listing"], // Include related data
      order: { sentAt: "DESC" }, // Most recent first
    });

    // Return messages array
    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get conversation for a specific listing
 * @param {Object} req - Express request with listing ID in params
 * @param {Object} res - Express response
 * @returns JSON response with conversation messages
 */
const getConversation = async (req, res) => {
  try {
    // Get Message repository
    const messageRepository = AppDataSource.getRepository("Message");
    
    // Get authenticated user ID
    const userId = req.user?.userId;
    
    // Extract listing ID from URL parameters
    const { listingId } = req.params;

    // Build query to find messages for this listing involving current user
    const messages = await messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.receiver", "receiver")
      .leftJoinAndSelect("message.listing", "listing")
      .where("message.listingID = :listingId", { listingId })
      .andWhere("(message.senderID = :userId OR message.receiverID = :userId)", { userId })
      .orderBy("message.sentAt", "ASC") // Chronological order for conversation flow
      .getMany();

    // Return conversation messages
    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Mark a message as read
 * @param {Object} req - Express request with message ID
 * @param {Object} res - Express response
 * @returns JSON response confirming update
 */
const markAsRead = async (req, res) => {
  try {
    // Get Message repository
    const messageRepository = AppDataSource.getRepository("Message");
    
    // Get authenticated user ID
    const userId = req.user?.userId;
    
    // Extract message ID from URL parameters
    const { id } = req.params;

    // Find message in database
    const message = await messageRepository.findOne({
      where: { messageID: parseInt(id) },
    });

    // Check if message exists
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    // Verify that current user is the receiver
    // Only message receiver can mark as read
    if (message.receiverID !== userId) {
      return res.status(403).json({
        success: false,
        error: "You can only mark your own received messages as read",
      });
    }

    // Update message read status
    message.isRead = true;
    await messageRepository.save(message);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Delete a message
 * @param {Object} req - Express request with message ID
 * @param {Object} res - Express response
 * @returns JSON response confirming deletion
 */
const deleteMessage = async (req, res) => {
  try {
    // Get Message repository
    const messageRepository = AppDataSource.getRepository("Message");
    
    // Get authenticated user ID
    const userId = req.user?.userId;
    
    // Extract message ID from URL parameters
    const { id } = req.params;

    // Find message to delete
    const message = await messageRepository.findOne({
      where: { messageID: parseInt(id) },
    });

    // Check if message exists
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    // Verify ownership - only sender can delete their message
    if (message.senderID !== userId) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own messages",
      });
    }

    // Remove message from database
    await messageRepository.remove(message);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all conversations for current user
 * Groups messages by listing and other user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns JSON response with conversations list
 */
const getConversations = async (req, res) => {
  try {
    const messageRepository = AppDataSource.getRepository("Message");
    const userId = req.user?.userId;

    // Get all messages involving this user
    const messages = await messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.listing", "listing")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.receiver", "receiver")
      .where("message.senderID = :userId OR message.receiverID = :userId", { userId })
      .orderBy("message.sentAt", "DESC")
      .getMany();

    // Group messages by conversation (listing + other user)
    const conversationsMap = new Map();

    messages.forEach((message) => {
      // SAFETY CHECK: Skip if listing or users are missing (deleted)
      if (!message.listing || !message.sender || !message.receiver) {
        return; 
      }

      const otherUserId = message.senderID === userId ? message.receiverID : message.senderID;
      const conversationKey = `${message.listingID}-${otherUserId}`;

      if (!conversationsMap.has(conversationKey)) {
        conversationsMap.set(conversationKey, {
          conversationId: conversationKey,
          listing: {
            listingID: message.listing.listingID,
            title: message.listing.title,
            price: message.listing.price,
          },
          otherUser: {
            userID: message.senderID === userId ? message.receiver.userID : message.sender.userID,
            fullName: message.senderID === userId ? message.receiver.fullName : message.sender.fullName,
            email: message.senderID === userId ? message.receiver.email : message.sender.email,
            profilePicture: message.senderID === userId ? message.receiver.profilePicture : message.sender.profilePicture,
          },
          lastMessage: message.messageText,
          lastMessageTime: message.sentAt,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.receiverID === userId && !message.isRead) {
        conversationsMap.get(conversationKey).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get chat messages between current user and another user for a specific listing
 * @param {Object} req - Express request with listingId and otherUserId params
 * @param {Object} res - Express response
 * @returns JSON response with messages
 */
const getChatMessages = async (req, res) => {
  try {
    const messageRepository = AppDataSource.getRepository("Message");
    const userId = req.user?.userId;
    const { listingId, otherUserId } = req.params;

    // Get all messages between these two users for this listing
    const messages = await messageRepository
      .createQueryBuilder("message")
      .where("message.listingID = :listingId", { listingId })
      .andWhere(
        "((message.senderID = :userId AND message.receiverID = :otherUserId) OR (message.senderID = :otherUserId AND message.receiverID = :userId))",
        { userId, otherUserId }
      )
      .orderBy("message.sentAt", "ASC")
      .getMany();

    // Mark received messages as read
    const unreadMessages = messages.filter((msg) => msg.receiverID === userId && !msg.isRead);
    if (unreadMessages.length > 0) {
      await messageRepository
        .createQueryBuilder()
        .update()
        .set({ isRead: true })
        .whereInIds(unreadMessages.map((msg) => msg.messageID))
        .execute();
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  sendMessage,
  getMyMessages,
  getConversations,
  getChatMessages,
  getConversation,
  markAsRead,
  deleteMessage,
};