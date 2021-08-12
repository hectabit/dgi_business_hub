/**
 * import modules
 */

const mongoose = require("mongoose");

//------------------------------------------------------------------------

/**
 * define schema
 */

// store schema
const adSchema = mongoose.Schema(
	{
		images: [String],
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

const Ad = new mongoose.model("ad", adSchema);

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Ad;
