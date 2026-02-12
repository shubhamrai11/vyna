const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// USER DEFINED FUNCTION
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes } = require("../../utility/constant");
const { sendVerifcationLink } = require("../../utility/email");
const { websitesendVerifcationLink } = require("../../utility/email");
const {encrypt} =require("../../utility/encryption");
const passwordResetModel = require("../../models/passwordResetModel");
const otpModel = require("../../models/otpModel");
const i18n = require("../../translation")
// SERVICES

// CREATING TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports._encryptPassword = (password) => {
  let salt = 10;
  // generate a salt
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) reject(err);
      // hash the password with new salt
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) reject(err);
        // override the plain password with the hashed one
        resolve(hash);
      });
    });
  });
};
// SEND TOKEN
exports.createSendToken = (user, res,successmessage) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  return{
    status: true,
    message: successmessage,
    token,
    data:user,
  };
};

exports.sendEmailVerificationLink = async (body,user) => {
  try {
    const email = body.email.toLowerCase();;
    const otpData = { email: email};
    
    let encrypted=await encrypt(email);

    const encryptedpasswordToken = {
      email: email,
      encrypted_token: encrypted,
      isUsed: false,
    };
    
    await passwordResetModel.create(encryptedpasswordToken);
    
    let userTemplate = {email: email,token:encrypted};
    
    await sendVerifcationLink(userTemplate);

    return {
      status: true,
       message :i18n.__('verification_link')

    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.websitesendEmailVerificationLink = async (body,user) => {
  try {
    const email = body.email.toLowerCase();;
    const otpData = { email: email};
    
    let encrypted=await encrypt(email);

    
    const encryptedpasswordToken = {
      email: email,
      encrypted_token: encrypted,
      isUsed: false,
    };
    
    await passwordResetModel.create(encryptedpasswordToken);
    // console.log("encrypted",encrypted)
    let userTemplate = {email: email,token:encrypted,role:user.role};
    // console.log("userTemplate",userTemplate)
    await websitesendVerifcationLink(userTemplate);

    return {
      status: true,
      // message: req.__("verification_link")
      message :i18n.__('verification_link')
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

