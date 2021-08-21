const Merchant = require("../models/Merchant");
const MerchantStag = require("../models/MerchantStag");
const ScanTransaction = require("../models/ScanTransaction");
const resConfig = require("../configs/error");
const s3 = require("../utils/s3");

//------------------------------------------------------------------------

const getStores = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;

    if (!categoryId) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    const stores = await Merchant.find({
      category: categoryId,
      firstTime: false,
    }).lean();

    stores.forEach((store, i) => {
      store.images.forEach((imgPath, index) => {
        if (imgPath != "") {
          store.images[index] = imgPath;
        }
      });
    });

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.stores = stores;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in get categories details", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const getStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    const store = await Merchant.findById(storeId);

    store.images.forEach((imgPath, index) => {
      if (imgPath != "") {
        store.images[index] = imgPath;
      }
    });

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.store = store;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in get categories details", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const createStore = async (req, res) => {
  try {
    const username = req.body.username;
    const storeData = req.body.storeData;

    if (!username || !Object.keys(storeData)) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    console.log(storeData);

    // uploading 3 images
    const adType = "jpg";
    if (storeData.images[0] != "") {
      const storeBase64One = new Buffer.from(
        storeData.images[0].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const s3ImgPathOne = `store/${username}/1_${Date.now()}.${adType}`;
      const pathOne = await s3.uploadFile(s3ImgPathOne, storeBase64One, adType);

      storeData.images[0] = pathOne;
    }

    if (storeData.images[1] != "") {
      const storeBase64Two = new Buffer.from(
        storeData.images[1].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const s3ImgPathTwo = `store/${username}/2_${Date.now()}.${adType}`;
      const pathTwo = await s3.uploadFile(s3ImgPathTwo, storeBase64Two, adType);

      storeData.images[1] = pathTwo;
    }

    if (storeData.images[2] != "") {
      const storeBase64Three = new Buffer.from(
        storeData.images[2].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const s3ImgPathThree = `store/${username}/3_${Date.now()}.${adType}`;
      const pathThree = await s3.uploadFile(
        s3ImgPathThree,
        storeBase64Three,
        adType
      );

      storeData.images[2] = pathThree;
    }
    if (storeData.images[3] != "") {
      const storeBase64Four = new Buffer.from(
        storeData.images[3].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const s3ImgPathFour = `store/${username}/4_${Date.now()}.${adType}`;
      const pathFour = await s3.uploadFile(
        s3ImgPathFour,
        storeBase64Four,
        adType
      );

      storeData.images[3] = pathFour;
    }

    if (storeData.images[4] != "") {
      const storeBase64Five = new Buffer.from(
        storeData.images[4].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const s3ImgPathFive = `store/${username}/5_${Date.now()}.${adType}`;
      const pathFive = await s3.uploadFile(
        s3ImgPathFive,
        storeBase64Five,
        adType
      );

      storeData.images[4] = pathFive;
    }

    // setting data
    const store = await MerchantStag.findOneAndUpdate(
      { username },
      { $set: { ...storeData, firstTime: false } },
      { new: true, upsert: true }
    ).lean();

    // store.images.forEach((imgPath, index) => {
    // 	if (imgPath != "") {
    // 		store.images[index] = imgPath;
    // 	}
    // });

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.store = store;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in get categories details", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const getTransaction = async (req, res) => {
  try {
    const merchantUsername = req.query.merchantUsername;

    if (!merchantUsername) {
      return res
        .status(resConfig.BAD_REQUEST.status)
        .send(resConfig.BAD_REQUEST);
    }

    const transactions = await ScanTransaction.find({
      merchantUsername,
    })
      .populate("discount")
      .lean();

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.transactions = transactions;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in get categories details", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};

const getAllTransaction = async (req, res) => {
  try {
    const transactions = await ScanTransaction.find({})
      .populate("discount", "-__v -_id")
      .lean()
      .select("-__v -_id -updatedAt");

    const resPayload = { ...resConfig.SUCCESS };
    resPayload.transactions = transactions;

    return res.status(resConfig.SUCCESS.status).send(resPayload);
  } catch (error) {
    console.log("error in get categories details", error);
    return res
      .status(resConfig.SERVER_ERROR.status)
      .send(resConfig.SERVER_ERROR);
  }
};
//------------------------------------------------------------------------

module.exports = {
  getStores,
  createStore,
  getStore,
  getTransaction,
  getAllTransaction,
};
