const Login = require("../models/Login");
const jwtKey = process.env.JWT_KEY;

//------------------------------------------------------------------------

const isUserAdmin = async (req, res, next) => {
	try {
		let { authorization } = req.headers;

		if (!authorization) {
			return res.status(400).send({
				status: 400,
				message: "Authorization token not found",
			});
		}

		authorization = authorization.split(" ").pop();

		const loginRes = await Login.findOne({
			jwt: authorization,
			userType: 1,
		}).select(["_id"]);

		if (!loginRes) {
			return res.status(201).send({
				status: 201,
				message: "Admin is not logged in",
			});
		}

		next();
	} catch (error) {
		console.log("error", error);

		res.locals.status = 500;
		res.locals.data = { status: 500, message: "internal server error" };
		return resMiddleware.sendRes(req, res);
	}
};

const isUserMerchant = async (req, res, next) => {
	try {
		let { authorization } = req.headers;

		if (!authorization) {
			return res.status(400).send({
				status: 400,
				message: "Authorization token not found",
			});
		}

		authorization = authorization.split(" ").pop();

		const payLoad = decodeJwt(authorization, jwtKey);

		if (payLoad === -1) {
			return res.status(201).send({
				status: 201,
				message: "Unauthorized user",
			});
		}

		const { username, userType } = payLoad;

		if (userType !== "merchant") {
			return res.status(201).send({
				status: 201,
				message: "Unauthorized user",
			});
		}

		req.custom.username = username;
		next();
	} catch (error) {
		console.log("error", error);

		res.locals.status = 500;
		res.locals.data = { status: 500, message: "internal server error" };
		return resMiddleware.sendRes(req, res);
	}
};

//------------------------------------------------------------------------

module.exports = { isUserAdmin, isUserMerchant };
