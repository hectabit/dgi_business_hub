const resConfig = require("../configs/error");
const Discount = require("../models/Discount");

//------------------------------------------------------------------------

const getDiscounts = async (req, res) => {
	try {
		const discounts = await Discount.find({
			expireAt: { $gt: Date.now() },
		})
			.populate(
				"merchant",
				"-_id -address -contactNumber -name -images -businessName -discount -repeatTime -blocked -firstTime -password -email -createdAt -updatedAt -__v -isApproved -category"
			)
			.lean();

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.discounts = discounts;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in get discounts", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

const createDiscount = async (req, res) => {
	try {
		const { merchant, expireAt, discount, total, noOfScan } = req.body;
		if (!merchant || !expireAt || !discount || !total || !noOfScan) {
			return res
				.status(resConfig.BAD_REQUEST.status)
				.send(resConfig.BAD_REQUEST);
		}
		const discountObj = new Discount({
			merchant,
			expireAt,
			discount,
			total,
			noOfScan,
		});
		await discountObj.save();

		const discounts = await Discount.find({}).lean();

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.discounts = discounts;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in add discount details", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

const deleteDiscount = async (req, res, next) => {
	try {
		const { id } = req.body;

		if (!id) {
			return res
				.status(resConfig.BAD_REQUEST.status)
				.send(resConfig.BAD_REQUEST);
		}

		await Discount.findOneAndDelete({ _id: id });

		const resPayload = { ...resConfig.SUCCESS };
		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in delete discount details", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};
//------------------------------------------------------------------------

module.exports = { getDiscounts, createDiscount, deleteDiscount };
