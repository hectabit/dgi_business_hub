/**
 * import modules
 */

const mongoose = require("mongoose");

//------------------------------------------------------------------------

/**
 * define schema
 */

// user schema
const scanTransactionSchema = mongoose.Schema(
	{
		merchantUsername: {
			type: String,
			index: true,
			required: true,
		},
		refNo: {
			type: String,
			index: true,
			required: true,
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

const ScanTransaction = new mongoose.model("scanTransaction", scanTransactionSchema);

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = ScanTransaction;
