const StoreCategory = require("../models/StoreCategory");
const resConfig = require("../configs/error");

//------------------------------------------------------------------------

const getCategories = async (req, res) => {
	try {
		const categories = await StoreCategory.find({}).lean();

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.categories = categories;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in get categories details", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

const createCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res
				.status(resConfig.BAD_REQUEST.status)
				.send(resConfig.BAD_REQUEST);
		}

		const CAT = new StoreCategory({
			name,
		});

		await CAT.save();

		// get categories
		const categories = await StoreCategory.find({}).lean();

		const resPayload = { ...resConfig.SUCCESS };
		resPayload.categories = categories;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in get categories details", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};

//------------------------------------------------------------------------

module.exports = { getCategories, createCategory };
