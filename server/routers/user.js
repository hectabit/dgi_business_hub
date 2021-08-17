const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const { loginUser, createMerchant, scanCode, getAllMerchant, getMerchantDetailsById, approveMerchantById } = require("../apis/user");
const { isUserAdmin, isUserThere } = require("../middleware");

//------------------------------------------------------------------------

/**
 * define routes
 */
router.post("/login", loginUser);
router.post(
	"/create",
	// isUserAdmin,
	createMerchant
);
router.post("/scan", isUserThere, scanCode);
router.get("/all", getAllMerchant);
router.get("/", getMerchantDetailsById);
router.get("/approve", approveMerchantById);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
