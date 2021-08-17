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
router.post("/login", loginUser);
router.post(
  "/create",
  // isUserAdmin,
  createMerchant
);
router.post("/scan", isUserThere, scanCode);

//------------------------------------------------------------------------

/**
 * export modules
 */
module.exports = router;
