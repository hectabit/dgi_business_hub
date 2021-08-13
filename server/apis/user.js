const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//------------------------------------------------------------------------

const resConfig = require("../configs/error");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const cryptoUtils = require("../utils/crypto");
const { sendMail } = require("../utils/mail");

//------------------------------------------------------------------------

const jwtKey = process.env.JWT_KEY;
const authTokenDuration = process.env.AUTH_TOKEN_DURATION;
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
//------------------------------------------------------------------------

module.exports = { loginUser, createMerchant };
