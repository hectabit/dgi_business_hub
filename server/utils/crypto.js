const jwt = require("jsonwebtoken");
var generator = require("generate-password");

//------------------------------------------------------------------------

const encodeJwt = (payLoad, key, duration) =>
	jwt.sign(
		{
			data: payLoad,
		},
		key,
		{ expiresIn: duration }
	);

const decodeJwt = (token, key) => {
	try {
		return jwt.verify(token, key);
	} catch (error) {
		return -1;
	}
};

const generateRandomPassword = (length) => {
	return generator.generate({
		length,
		numbers: true,
	});
};

//------------------------------------------------------------------------

module.exports = { encodeJwt, generateRandomPassword, decodeJwt };
