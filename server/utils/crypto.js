const jwt = require("jsonwebtoken");

//------------------------------------------------------------------------

const encodeJwt = (payLoad, key, duration) =>
	jwt.sign(
		{
			data: payLoad,
		},
		key,
		{ expiresIn: duration }
	);

//------------------------------------------------------------------------

module.exports = { encodeJwt };
