const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------

const {
	loginUser,
	createMerchant,
	scanCode,
	getGiftCards,
	getAllMerchant,
	getMerchantDetailsById,
	approveMerchantById,
	disapproveMerchantById,
	changeMerchantPassword,
	getUserDetails,
} = require("../apis/user");
const { isUserAdmin, isUserThere } = require("../middleware");

//------------------------------------------------------------------------

/**
 * define routes
 */
router.get("/giftCards", isUserThere, getGiftCards);
router.get("/all", getAllMerchant);
router.get("/", getMerchantDetailsById);
router.get("/approve", approveMerchantById);
router.get("/disapprove", disapproveMerchantById);
router.get("/details", getUserDetails);
router.post("/login", loginUser);
router.post(
	"/create",
	// isUserAdmin,
	createMerchant
);
router.post("/scan", isUserThere, scanCode);
router.post("/changePassword", changeMerchantPassword);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
