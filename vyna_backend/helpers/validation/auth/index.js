
// const JoiBase = require('@hapi/joi');
// const JoiDate = require("@hapi/joi-date");
// const Regex = require("../../../core/regex");
// const Joi = JoiBase.extend(JoiDate);
const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  login:[
    body("email", "Please enter email").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("password", "Please enter password").exists().notEmpty(),
    body("deviceToken", "Device token is required").exists().notEmpty(),
    body("is_accept","Please accept trems and conditions").exists().custom((value) => {
        if (value !== true) {
            throw new Error(`is_accept must be true`);
        }
        return true;
    }),
  ],
  forgot_password:[
   
    body("email", "Email code is required").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
  ],
  verify_otp:[
   
    body("email", "Email code is required").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("otp", "Please enter OTp").exists().trim().isLength(4, 4)
    .withMessage('OTP should be 4 digits.')
  ],
  reset_password:[
    body("email", "Please enter email").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("password", "Please enter password").exists().notEmpty().isLength({ min: 8, max: 15 })
    .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    .matches(/\d/)
    .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should be between 8 to 16 characters long and it should contain atleast 1 Number,1 Special Character, 1 UpperCase and 1 LowerCase"),
    
    body("token", "Reset password token is required").exists().notEmpty(),
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