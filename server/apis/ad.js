//------------------------------------------------------------------------

const Ad = require("../models/Ad");
const s3 = require("../utils/s3");
const resConfig = require("../configs/error");

//------------------------------------------------------------------------

const createAd = async (req, res) => {
	try {
		const { index, adImage } = req.body;

		if (typeof index !== "number" || !adImage) {
			return res
				.status(resConfig.BAD_REQUEST.status)
				.send(resConfig.BAD_REQUEST);
		}

		// uploading to s3
		const adBase64 = new Buffer.from(
			adImage.replace(/^data:image\/\w+;base64,/, ""),
			"base64"
		);
		const adType = "jpg";

		const s3ImgPath = `ad/${index}_${Date.now()}.${adType}`;

		const path = await s3.uploadFile(s3ImgPath, adBase64, adType);
		const adData = await Ad.findOne({});

		if (adData && adData.images.length) {
			await Ad.updateOne({}, { $set: { [`images.${index}`]: path } });
		} else {
			const adArr = ["", "", ""];

			adArr[index] = path;

			const ad = new Ad({
				images: adArr,
			});

			await ad.save();
		}

		const ad = await Ad.findOne({}).select(["images", "-_id"]).lean();

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.ads = ad;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in create ad", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

const getAds = async (req, res) => {
	try {
		const ads = await Ad.findOne({}).select(["images", "-_id"]).lean();

		ads.images.forEach((adPath, index) => {
			if (adPath != "") {
				ads.images[index] = adPath;
			}
		});

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.ads = ads;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in get ads details", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

//------------------------------------------------------------------------

module.exports = { createAd, getAds };
