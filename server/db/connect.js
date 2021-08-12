/**
 * This module establish the connection with database
 */

const mongoose = require("mongoose");
const chalk = require("chalk");

//------------------------------------------------------------------------

/**
 * global variables
 */

const mongoUrl = process.env.DB_URL;

//------------------------------------------------------------------------

// this function establish the connection between node server and mongo database
const connectDB = () => {
	return new Promise((resolve, reject) => {
		mongoose
			.connect(mongoUrl, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			})
			.then((res) => {
				console.log(chalk.green.inverse("DB Connection Successful"));
				return resolve("");
			})
			.catch((err) => {
				console.log("error", err);

				console.log(chalk.red.inverse("DB Connection Failed"));
				return reject("");
			});
	});
};

//------------------------------------------------------------------------

/**
 * Export the modules
 */

module.exports = connectDB;
