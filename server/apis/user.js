const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//------------------------------------------------------------------------

const resConfig = require("../configs/error");
const Merchant = require("../models/Merchant");
const User = require("../models/user");
const cryptoUtils = require("../utils/crypto");

//------------------------------------------------------------------------

const jwtKey = process.env.jwtKey;
const authTokenDuration = process.env.AUTH_TOKEN_DURATION;

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

		// if usertype is user
		const user = await User.findOne({ refNo: username })
			.select(["refNo", "password"])
			.lean();

		if (user) {
			comparedPassword = user.password;
			userType = "user";
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

		const resPayload = resConfig.SUCCESS;
		resPayload.token = token;
		resPayload.userType = userType;
		resPayload.blocked = blocked;
		resPayload.fistTime = fistTime;

		return res.status(resConfig.SUCCESS.status).send(resPayload);
	} catch (error) {
		console.log("error in loginUser", error);
		return res
			.status(resConfig.SERVER_ERROR.status)
			.send(resConfig.SERVER_ERROR);
	}
};
//------------------------------------------------------------------------

module.exports = {};
