require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");

//------------------------------------------------------------------------

const connectDB = require("./server/db/connect");
const userRouters = require("./server/routers/user");
const adRouters = require("./server/routers/ad");
const categoryRouters = require("./server/routers/category");
const storeRouters = require("./server/routers/store");
const discountRouters = require("./server/routers/discount");

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
app.use(express.json({ limit: "50mb" }));
// app.use(express.json());

app.use("/api/user", userRouters);
app.use("/api/ad", adRouters);
app.use("/api/category", categoryRouters);
app.use("/api/store", storeRouters);
app.use("/api/discount", discountRouters);

app.get("/info", async (req, res) => {
  return res.status(200).send({
    version,
    env,
    deployed: "Done",
  });
});

//------------------------------------------------------------------------

connectDB().then((res) => {
  app.listen(port, () =>
    console.log(chalk.blue.inverse(`Server is running on port ${port}`))
  );
});

//------------------------------------------------------------------------
