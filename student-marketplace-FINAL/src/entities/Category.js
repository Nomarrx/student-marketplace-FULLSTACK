/**
 * File: Category.js
 * Description: Category entity for item classification (lookup table)
 * Author: Darrel Okoukoni,Divine Nworisa, Vyas Harsh
 * Date: October 2025
 */

const { EntitySchema } = require("typeorm");

const Category = new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    categoryID: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
    },
    icon: {
      type: String,
      nullable: true,
    },
  },
});

module.exports = { Category };
