const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { isUserAdmin } = require("../middleware");
const { createDiscount,getDiscounts } = require("../apis/discount");

//------------------------------------------------------------------------

/**
 * define routes
 */

router.post(
	"/",
	//  isUserAdmin,
	createDiscount
);
router.get("/", getDiscounts);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
