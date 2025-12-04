/**
 * File: Message.js
 * Description: Message entity for communication between users about listings
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { EntitySchema } = require("typeorm");

const Message = new EntitySchema({
  name: "Message",
  tableName: "messages",
  columns: {
    messageID: {
      type: Number,
      primary: true,
      generated: true,
    },
    listingID: {
      type: Number,
    },
    senderID: {
      type: Number,
    },
    receiverID: {
      type: Number,
    },
    messageText: {
      type: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    listing: {
      type: "many-to-one",
      target: "Listing",
      joinColumn: {
        name: "listingID",
      },
    },
    sender: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "senderID",
      },
    },
    receiver: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "receiverID",
      },
    },
  },
});

module.exports = { Message };
