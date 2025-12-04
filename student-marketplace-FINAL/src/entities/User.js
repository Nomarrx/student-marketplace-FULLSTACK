/**
 * File: User.js
 * Description: User entity representing registered users in the marketplace
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    userID: {
      type: Number,
      primary: true,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      nullable: true,
    },
    campusLocation: {
      type: String,
      nullable: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    studentIDUrl: {
      type: String,
      nullable: true,
    },
    verifiedAt: {
      type: "timestamp",
      nullable: true,
    },
    joinDate: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    listings: {
      type: "one-to-many",
      target: "Listing",
      inverseSide: "seller",
    },
    sentMessages: {
      type: "one-to-many",
      target: "Message",
      inverseSide: "sender",
    },
    receivedMessages: {
      type: "one-to-many",
      target: "Message",
      inverseSide: "receiver",
    },
  },
});

module.exports = { User };
