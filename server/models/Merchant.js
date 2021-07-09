/**
 * import modules
 */

const mongoose = require("mongoose");

//------------------------------------------------------------------------

/**
 * define schema
 */

// user schema
const merchantSchema = mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		name: {
			type: String,
			default: "",
		},
		email: {
			type: email,
			required: true,
		},
		businessName: {
			type: String,
			default: "",
		},
		address: {
			address1: {
				type: String,
				default: "",
			},
			address2: {
				type: String,
				default: "",
			},
			landmark: {
				type: String,
				default: "",
			},
			pincode: {
				type: String,
				default: "",
			},
			city: {
				type: String,
				default: "",
			},
			state: {
				type: String,
				default: "",
			},
			country: {
				type: String,
				default: "",
			},
		},
		discount: {
			type: Number,
			default: -1,
		},
		repeatTime: {
			type: Number,
			default: 0,
		},
		blocked: {
			type: Boolean,
			default: false,
			enum: [true, false],
		},
		firstTime: {
			type: Boolean,
			default: true,
			enum: [true, false],
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

const Merchant = new mongoose.model(
	"merchant",
	merchantSchema,
	"merchants"
);

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Merchant;
