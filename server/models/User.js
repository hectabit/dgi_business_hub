/**
 * import modules
 */

const mongoose = require("mongoose");
const tree = require("../utils/tree");

//------------------------------------------------------------------------

/**
 * define schema
 */

const bankSchema = mongoose.Schema({
	ifsc: {
		type: String,
		trim: true,
	},
	accountName: {
		type: String,
		trim: true,
	},
	accountNo: {
		type: String,
		trim: true,
	},
	bankName: {
		type: String,
		trim: true,
	},
});

// user schema
const userSchema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	contactNo: {
		type: String,
		trim: true,
		required: true,
	},
	balance: {
		type: Number,
		default: 0,
	},
	tds: {
		type: Number,
		default: 0,
	},
	renew: {
		type: Number,
		default: 0,
	},
	spent: {
		type: Number,
		default: 0,
	},
	path: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		trim: true,
		required: true,
	},
	referee: {
		type: String,
		trim: true,
		required: true,
		index: true,
	},
	refNo: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Number,
		default: Date.now,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	activated: {
		type: Boolean,
		default: false,
	},
	level: {
		type: Number,
		enum: [-1, 0, 1, 2, 3, 4, 5],
		default: -1,
	},
	version: {
		type: String,
		trim: true,
		required: true,
	},
	blocked: {
		type: Boolean,
		default: false,
		index: true,
	},
	bank: bankSchema,
});

//------------------------------------------------------------------------

/**
 * Create a model
 */

const User = new mongoose.model("user", userSchema, "users");

//------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = User;
