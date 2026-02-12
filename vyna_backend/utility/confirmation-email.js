'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
});
module.exports = {
	sendEmail: async (emailBody) => {
		try {
			// send mail with defined transport object
			let emailInfo = {
				//  Sender address
                from: '"Notifications" <notifications@airsat.com>', //sender address
			
				to: emailBody.recipientsAddress, // Email id of receivers
				subject: emailBody.subject, // Subject line
				html: emailBody.body
			};
			transporter.sendMail(emailInfo);
			return true;
		}
		catch (error) {
			return error;
		}
	},
}

