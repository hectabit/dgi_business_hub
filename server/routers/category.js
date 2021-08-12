const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { getCategories, createCategory } = require("../apis/category");
const { isUserAdmin } = require("../middleware");

//------------------------------------------------------------------------

/**
 * define routes
 */
router.get("/", getCategories);
router.post(
	"/",
	// isUserAdmin,
	createCategory
);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
