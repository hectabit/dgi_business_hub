const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { isUserAdmin } = require("../middleware");
const {
	createDiscount,
	getDiscounts,
	deleteDiscount,
} = require("../apis/discount");

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
router.delete("/", deleteDiscount);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
