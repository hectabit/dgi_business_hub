const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { loginUser, createMerchant } = require("../apis/user");
const { isUserAdmin } = require("../middleware");

//------------------------------------------------------------------------

/**
 * define routes
 */
router.post("/login", loginUser);
router.post("/create", isUserAdmin, createMerchant);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
