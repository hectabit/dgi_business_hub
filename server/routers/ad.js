const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { isUserAdmin } = require("../middleware");
const { createAd, getAds } = require("../apis/ad");

//------------------------------------------------------------------------

/**
 * define routes
 */

router.post(
	"/",
	//  isUserAdmin,
	createAd
);
router.get("/", getAds);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
