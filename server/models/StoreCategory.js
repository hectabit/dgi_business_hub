/**
 * import modules
 */

const mongoose = require("mongoose");

//------------------------------------------------------------------------

/**
 * define schema
 */

// store schema
const storeCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    imgPath: {
      type: String,
    },
    updatedAt: {
      type: Number,
    },
    createdAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

//------------------------------------------------------------------------

/**
 * Create a model
 */

const StoreCategory = new mongoose.model("storeCategory", storeCategorySchema);

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = StoreCategory;
