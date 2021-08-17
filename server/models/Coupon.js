/**
 * import modules
 */

const mongoose = require("mongoose");

//------------------------------------------------------------------------

/**
 * define schema
 */

// user schema
const couponSchema = mongoose.Schema(
	{
		refNo: {
			type: String,
			unique: true,
		},
		count: {
			type: Number,
			required: true,
			default: 32,
		},
		redeemedCount:{
			type: Number,
			default: 0,
		},
		lastTime: [
			{
				username: String,
				time: Number,
			},
		],
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

const Coupon = new mongoose.model("coupon", couponSchema);

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Coupon;
