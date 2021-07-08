require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");

//------------------------------------------------------------------------

const port = process.env.PORT || 80;
const version = process.env.VERSION || "";
const env = process.env.ENV || "";

//------------------------------------------------------------------------

const app = express();

app.use(cors());

app.get("/info", async (req, res) => {
	return res
		.status(200)
		.send({
			developers: "Hectabit Inc.",
			website: "https://www.hectabit.com",
			version,
            env
		});
});
//------------------------------------------------------------------------

app.listen(port, () =>
	console.log(chalk.green.inverse(`Server is running on port ${port}`))
);
