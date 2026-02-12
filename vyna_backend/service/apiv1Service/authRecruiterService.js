const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes, userRole } = require("../../utility/constant");
const userModel = require("../../models/userModel");
const { sendPasswordUser } = require("../../utility/email");
const i18n = require("../../translation")

exports.create = async (body,res) => {
  try {
    console.log("365246job12");
    const userData = await userModel.findOne({
      email: body.email,
      isDeleted: false
    });
    if (userData !== null) {
      return {
        status: false,
        // message: "Email ID already exists"
        message: res.__("email_ID_already_exists")
      };
    }

    body.role = userRole.RECRUITER;
    var randomstring = Math.random().toString(36).slice(-8);
    body.password = randomstring;
    body.email = body.email.toLowerCase();
    let user = await userModel.create(body).then();
    let userTemplate = { email: body.email, password: randomstring };
    await sendPasswordUser(userTemplate);
    console.log("Current Locale:", i18n.getLocale());

    return {
      statusCode: statusCodes.CREATED,
      status: "success",
      // message: `Recruiter Created Successfully`,
      message: res.__("new_recruited_created"),
      data: user,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.getByID = async (id,res) => {
  try {
    let user = await userModel.findById(id).populate('createdBy').populate('updatedBy').then();
    if (user === null || user.isDeleted) {
      throw new UserNotFoundError("User not found");
    }
    
    return {
      status: "success",
      // message: `Get Recruiter User`,
      message: res.__("get_recruiter"),
      user: user,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.updateUser = async (id, userBody,res) => {
  try {
    if (userBody.email) {
      userBody.email = userBody.email.toLowerCase();
    }
    const user = await userModel.findByIdAndUpdate(id, userBody, { new: true });

    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    console.log("Current Locale:", i18n.getLocale());
    return {
      status: true,
      // message: "Profile updated successfully",
      message: res.__("profile_update_successfully"),
      user,
    };
  } catch (error) {
    throw new UserError(error.message, error.statusCode || statusCodes.INTERNAL_SERVER);
  }
};


