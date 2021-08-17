module.exports = {
	BAD_REQUEST: {
		code: "BAD_REQUEST",
		status: 400,
		message: "invalid parameters",
	},

	NOT_FOUND: {
		code: "NOT_FOUND",
		status: 404,
	},

	SUCCESS: {
		status: 200,
		code: "SUCCESS",
	},

	SERVER_ERROR: {
		code: "INTERNAL_SERVER_ERROR",
		message: "There is some error in the server",
		status: 500,
	},

	UNAUTHORIZED: {
		code: "UNAUTHORIZED",
		status: 401,
	},

	API_KEY_NOT_FOUND: {
		status: 404,
		code: "APP_KEY and APP_SECRET not found",
	},
};
