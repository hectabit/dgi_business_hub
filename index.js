require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");

//------------------------------------------------------------------------

const connectDB = require("./server/db/connect");

//------------------------------------------------------------------------

/**
 * global variables
 */
const port = process.env.PORT || 80;
const version = process.env.VERSION || "";
const env = process.env.ENV || "";

//------------------------------------------------------------------------

const app = express();

app.use(cors());
app.use(express.json());

app.get("/info", async (req, res) => {
	return res.status(200).send({
		version,
		env,
	});
});

//------------------------------------------------------------------------

connectDB().then((res) => {
	app.listen(port, () =>
		console.log(chalk.blue.inverse(`Server is running on port ${port}`))
	);
});
