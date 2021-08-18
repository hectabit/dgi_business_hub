const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

//------------------------------------------------------------------------

const resConfig = require("../configs/error");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const GiftCard = require("../models/GiftCard");
const Discount = require("../models/Discount");
const cryptoUtils = require("../utils/crypto");
const { sendMail } = require("../utils/mail");
const Coupon = require("../models/Coupon");
const ScanTransaction = require("../models/ScanTransaction");
const mongoose = require("mongoose");

//------------------------------------------------------------------------

const jwtKey = process.env.JWT_KEY;
const authTokenDuration = Number(process.env.AUTH_TOKEN_DURATION);
const passRound = process.env.PASS_ROUND;

//------------------------------------------------------------------------

const loginUser = async (req, res) => {
  try {
    // get username and password
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    let comparedPassword = "";
    let userType = "";
    let firstTime = "";
    let blocked = "";
    let balance = null;

    // if user type is user
    const user = await User.findOne({ refNo: username })
      .select(["refNo", "password", "balance"])
      .lean();

    if (user) {
      comparedPassword = user.password;
      userType = "user";
      balance = user.balance;
    }

    // if userType is merchant
    if (!comparedPassword) {
      const merchant = await Merchant.findOne({ username })
        .select(["username", "password", "blocked", "firstTime"])
        .lean();

      if (merchant) {
        comparedPassword = merchant.password;
        firstTime = merchant.firstTime;
        blocked = merchant.blocked;
        userType = "merchant";
      }
    }

    // check the password
    if (
      !comparedPassword ||
      !(await bcrypt.compare(password, comparedPassword))
    ) {
      return res
        .status(resConfig.UNAUTHORIZED.status)
        .send(resConfig.UNAUTHORIZED);
    }

    const payLoad = { username, userType, blocked };

    // generate token for the user
    const token = cryptoUtils.encodeJwt(payLoad, jwtKey, authTokenDuration);

    if (userType === "user") {
      const couponData = await Coupon.findOne({ refNo: username }).lean();

      if (!couponData) {
        const COUPON = new Coupon({
          refNo: username,
          lastTime: [],
        });

        await COUPON.save();
      }
    }

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.token = token;
    resPayload.username = username;
    resPayload.userType = userType;
    resPayload.blocked = blocked;
    resPayload.firstTime = firstTime;
    resPayload.balance = balance;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in loginUser", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const createMerchant = async (req, res) => {
  try {
    // get username and password
    const { email } = req.body;

    if (!email) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    // generate username
    let username = `DBH_`;

    for (let i = 0; i < 6; i++) {
      username += Math.ceil(Math.random() * 10);
    }

    // generate random password
    const password = cryptoUtils.generateRandomPassword(10);

    const hashedPassword = await bcrypt.hash(password, parseInt(passRound));

    // create merchant
    const MERCHANT = new Merchant({
      username,
      password: hashedPassword,
      email,
    });

    await MERCHANT.save();

    // send username and password to merchant
    console.log("---", username, password, email);

    await sendMail(
      email,
      "Your username and password",
      `username:${username}<br>password:${password}`
    );

    return res.status(resConfig.SUCCESS.status).send(resConfig.SUCCESS);
  } catch (error) {
    console.log("error in createMerchant", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const scanCode = async (req, res) => {
  try {
    // get username and password
    const { merchantUsername, GiftCardCode } = req.body;
    const username = req.custom.username;

    console.log(merchantUsername, GiftCardCode, username);

    if (!merchantUsername || !username) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    // get user coupon data
    const couponData = await Coupon.findOne({ refNo: username }).lean();

    if (!couponData) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    const couponCount = couponData.count;

    if (couponCount <= 0) {
      const resObj = { ...resConfig.BAD_REQUEST };
      resObj.message = "invalid coupon count";
      return res.status(resObj.status).send(resObj);
    }

    // get repeat time of the store
    const merchantData = await Merchant.findOne({
      username: merchantUsername,
    }).lean();

    console.log(merchantData);

    if (!merchantData) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    const repeatTime = Number(merchantData.repeatTime) * 24 * 60 * 60 * 1000;

    let lastTime = null;

    for (const time of couponData.lastTime) {
      if (time.username === merchantUsername) {
        lastTime = time.time;
      }
    }

    let shouldPermit = false;
    if (!lastTime) {
      shouldPermit = true;
    }

    const timeDiff = Date.now() - lastTime;

    if (timeDiff >= repeatTime) shouldPermit = true;

    if (!shouldPermit) {
      const resObj = { ...resConfig.BAD_REQUEST };
      resObj.message = "Please try after sometime";
      return res.status(resObj.status).send(resObj);
    }

    // decrease the count and update the lasttime
    let found = false;

    for (const time of couponData.lastTime) {
      if (time.username === merchantUsername) {
        // update the time
        time.time = Date.now();
        found = true;
      }
    }

    if (!found) {
      couponData.lastTime.push({
        username: merchantUsername,
        time: Date.now(),
      });
    }

    let isDiscountApplied = false;
    if (GiftCardCode) {
      let isValidCode = await GiftCard.exists({
        "giftCards.code": GiftCardCode,
        "giftCards.used": false,
      });
      if (isValidCode) {
        let obj = await GiftCard.updateOne(
          { user: username, "giftCards.code": GiftCardCode },
          { $set: { "giftCards.$.used": true } }
        );
        isDiscountApplied = true;
      } else {
        return res.status(resConfig.NOT_FOUND.status).send({
          ...resConfig.NOT_FOUND,
          code: "GiftCard Code is not valid or expired",
        });
      }
    }
    // update the coupon data
    await Coupon.findOneAndUpdate(
      { refNo: username },
      {
        $inc: { count: -1, redeemedCount: 1 },
        $set: { lastTime: couponData.lastTime },
      }
    );
    let transaction = await Coupon.findOne({ refNo: username }).lean();

    let discountObjs = await Discount.find({
      expireAt: { $gt: Date.now() },
      noOfScan: transaction.redeemedCount,
      total: { $gt: 0 },
    }).lean();
    if (discountObjs.length) {
      let discounts = discountObjs.map((e) => ({
        discount: e._id,
        used: false,
        code: uuidv4(),
      }));
      let giftCardsExist = await GiftCard.exists({ user: username });
      if (!giftCardsExist) {
        let giftCard = new GiftCard({ user: username, giftCards: discounts });
        await giftCard.save();
      } else {
        await GiftCard.findOneAndUpdate(
          { user: username },
          { $push: { giftCards: { $each: discounts } } }
        );
      }

      for (let discountObj of discountObjs) {
        await Discount.findOneAndUpdate(
          { _id: discountObj._id },
          {
            $inc: { total: -1 },
          }
        );
      }
    }

    let resSendObj = {
      merchantUsername,
      refNo: username,
    };
    if (isDiscountApplied) {
      let temp = await GiftCard.findOne({
        "giftCards.code": GiftCardCode,
      }).lean();
      resSendObj.discount = temp.giftCards[0].discount;
    }
    // create a scan transaction
    const SCANTRANSACTION = new ScanTransaction(resSendObj);

    await SCANTRANSACTION.save();

    return res.status(resConfig.SUCCESS.status).send(resConfig.SUCCESS);
  } catch (error) {
    console.log("error in scan", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};
const getGiftCards = async (req, res) => {
  try {
    const username = req.custom.username;
    let resData = await GiftCard.find({ user: username })
      .populate("giftCards.discount", "-_id -__v -total -createdAt -updatedAt")
      .select("-_id -__v -createdAt -updatedAt")
      .lean();
    const resPayload = { ...resConfig.SUCCESS };
    resPayload.giftCards = resData;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in getGiftCard", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};
const getAllMerchant = async (req, res, next) => {
  try {
    // get approve flag: true or false
    const { approve } = req.query;

    if (approve == "") {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    // find all merchants with approve flag
    const merchants = await Merchant.find({ isApproved: approve }).lean();

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.merchants = merchants;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in createMerchant", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const getMerchantDetailsById = async (req, res, next) => {
  try {
    // get merchantId
    const { merchantId } = req.query;

    if (!merchantId) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(merchantId)) {
      query = {
        _id: merchantId,
      };
    } else {
      query = {
        username: merchantId,
      };
    }

    // find all merchants with approve flag
    const merchant = await Merchant.find(query).populate("category").lean();

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.merchant = merchant[0];

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in createMerchant", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const approveMerchantById = async (req, res, next) => {
  try {
    // get merchantId
    const { merchantId } = req.query;

    if (!merchantId) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    // update merchant approve flag
    await Merchant.findOneAndUpdate(
      { _id: merchantId },
      { $set: { isApproved: true } }
    );

    return res.status(resConfig.SUCCESS.status).send(resConfig.SUCCESS);
  } catch (error) {
    console.log("error in createMerchant", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

//------------------------------------------------------------------------

module.exports = {
  loginUser,
  createMerchant,
  scanCode,
  getGiftCards,
  getAllMerchant,
  getMerchantDetailsById,
  approveMerchantById,
};
