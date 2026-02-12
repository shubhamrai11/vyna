
// const JoiBase = require('@hapi/joi');
// const JoiDate = require("@hapi/joi-date");
// const Regex = require("../../../core/regex");
// const Joi = JoiBase.extend(JoiDate);
const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");
const i18n = require("../../../translation")
/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  login:[
    body("email").exists().trim().notEmpty().withMessage(i18n.__("email_required")),
    body("email").exists().trim().matches(REGX.Email).withMessage(i18n.__("email_invalid")),
    body("password").exists().notEmpty().withMessage(i18n.__("password_required"))
  ],
  update_profile:[
   
    // body("countryCode").exists().trim().notEmpty().matches(/^\+\d+$/)
    // .withMessage(`Country Code must contain only digits and  start with +`),
    body("mobileNumber", "Mobile Number is required").exists().notEmpty().isLength({ min: 6, max: 15 })
    .withMessage("Mobile Number should be between 6 to 15 digits.")
    .matches(/^\d+$/)
        .withMessage("Mobile Number should be between 6 to 15 digits"),
    body("first_name", "Name is required").exists().isLength({min:3 ,max: 50 }).withMessage("Name  should be between 3 to 50 characters."),
  ],
   verifyEmail:[
    body("token","Token Required").exists().notEmpty(),
  ],
   forgotPassword:[body("email", "Please enter valid email").exists().trim().notEmpty().matches(REGX.Email)],
  
   reset_password:[
    body("email").exists().trim().notEmpty().withMessage(i18n.__("email_required")),
    body("email").exists().trim().matches(REGX.Email).withMessage(i18n.__("email_invalid")),
    // body("password", "Please enter password").exists().notEmpty().isLength({ min: 8, max: 15 })
    // .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    // .matches(/\d/)
    // .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    // .matches(/[!@#$%^&*(),.?":{}|<>]/)
    // .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase"),


    body("password")
      .exists().withMessage(i18n.__("password_required"))
      .notEmpty().withMessage(i18n.__("password_required"))
      .isLength({ min: 8, max: 15 })
      .withMessage(i18n.__("password_invalid"))
      .matches(/\d/)
      .withMessage(i18n.__("password_invalid"))
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage(i18n.__("password_invalid")),

      body("token")
      .exists().notEmpty()
      .withMessage(i18n.__("token_required")),
    
    // body("token", "Reset password token is required").exists().notEmpty(),
  ],

  change_password:[
    body("old_password", "Please enter old password").exists().notEmpty(),
    body("password", "Please enter password").exists().notEmpty().isLength({ min: 8, max: 15 })
    .withMessage("Password should be between 8 to 16 characters long And it should contain AtLeast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    .matches(/\d/)
    .withMessage("Password should be between 8 to 16 characters long And it should contain AtLeast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should be between 8 to 16 characters long And it should contain AtLeast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase"),
    
   
  ],
  
}