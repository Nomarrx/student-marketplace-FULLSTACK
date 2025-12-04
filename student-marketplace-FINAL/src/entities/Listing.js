/**
 * File: Listing.js
 * Description: Listing entity representing items for sale in the marketplace
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */
const { EntitySchema } = require("typeorm");

const Listing = new EntitySchema({
  name: "Listing",
  tableName: "listings",
  columns: {
    listingID: {
      type: Number,
      primary: true,
      generated: true,
    },
    sellerID: {
      type: Number,
    },
    title: {
      type: String,
      length: 100,
    },
    description: {
      type: "text",
    },
    category: {
      type: String,
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    condition: {
      type: "enum",
      enum: ["new", "like-new", "good", "fair", "poor"],
    },
    imageUrls: {
      type: "json",
      nullable: true,
    },
    location: {
      type: String,
    },
    status: {
      type: "enum",
      enum: ["available", "pending", "sold"],
      default: "available",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    seller: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "sellerID",
      },
    },
    messages: {
      type: "one-to-many",
      target: "Message",
      inverseSide: "listing",
    },
  },
});

module.exports = { Listing };
