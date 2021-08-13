var nodemailer = require("nodemailer");

//------------------------------------------------------------------------

var transporter = nodemailer.createTransport({
	service: "gmail",
	secure: true,
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendMail = (to, subject, html) => {
	return new Promise((resolve, reject) => {
		var mailOptions = {
			from: process.env.EMAIL_ID,
			to,
			subject,
			html,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				//console.log("ererere", error);
				reject(error);
			} else {
				resolve(to);
			}
		});
	});
};

//------------------------------------------------------------------------

module.exports = {sendMail}