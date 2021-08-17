const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const {
  getStores,
  getStore,
  createStore,
  getTransaction,
  getAllTransaction,
} = require("../apis/store");

//------------------------------------------------------------------------

/**
 * define routes
 */

router.get("/transactions", getTransaction);
router.get("/allTransactions", getAllTransaction);
router.get("/all", getStores);
router.get("/:id", getStore);
router.post("/", createStore);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
