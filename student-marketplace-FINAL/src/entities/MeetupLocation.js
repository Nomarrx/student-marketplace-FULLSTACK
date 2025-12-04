/**
 * File: MeetupLocation.js
 * Description: MeetupLocation entity for safe campus meeting spots (lookup table)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { EntitySchema } = require("typeorm");

const MeetupLocation = new EntitySchema({
  name: "MeetupLocation",
  tableName: "meetup_locations",
  columns: {
    locationID: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    buildingName: {
      type: String,
    },
    coordinates: {
      type: "json",
    },
    description: {
      type: "text",
      nullable: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
});

module.exports = { MeetupLocation };
