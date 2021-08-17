const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const {
  getStores,
  getStore,
  createStore,
  getTransaction,
} = require("../apis/store");

//------------------------------------------------------------------------

/**
 * define routes
 */

router.get("/transactions", getTransaction);
router.get("/all", getStores);
router.get("/:id", getStore);
router.post("/", createStore);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
