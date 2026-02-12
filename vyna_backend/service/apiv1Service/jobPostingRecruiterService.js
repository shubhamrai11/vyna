const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes, userRole } = require("../../utility/constant");
const userModel = require("../../models/userModel");
const { sendPasswordUser } = require("../../utility/email");
const i18n = require("../../translation")

exports.create = async (body) => {
  try {
   
    const userData = await userModel.findOne({
      email: body.email,
      isDeleted: false
    });
    if (userData !== null) {
      return {
        status: false,
        // message: "Email ID already exists"
        message: i18n.__("email_ID_already_exists")
      };
    }

    body.role = userRole.RECRUITER;
    var randomstring = Math.random().toString(36).slice(-8);
    body.password = randomstring;
    body.email = body.email.toLowerCase();
    let user = await userModel.create(body).then();
    let userTemplate = { email: body.email, password: randomstring };
    await sendPasswordUser(userTemplate);

    return {
      statusCode: statusCodes.CREATED,
      status: "success",
      // message: `Recruiter Created Successfully`,
      message: i18n.__("recruited_created"),
      data: user,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};