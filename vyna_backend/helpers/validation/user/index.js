
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

  create_user:[
    body("first_name", "First Name is required").exists().isLength({min:3 ,max: 50 }).trim().withMessage("First Name should be between 3 to 50 characters."),
    body("last_name", "Last Name is required").exists().isLength({min:3 ,max: 50 }).trim().withMessage("Last Name should be between 3 to 50 characters."),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("mobileNumber", "Mobile Number is required").if(body('mobileNumber').exists()).notEmpty().isLength({ min: 6, max: 15 })
       .withMessage("Mobile Number should be between 6 to 15 digits.")
         .matches(/^\d+$/)
        .withMessage("Mobile Number should be between 6 to 15 digits"),
    body("password", "Please enter password").exists().notEmpty(),
  ],
  update_user:[
    body("name", "Name is required").if(body('name').exists()).isLength({min:3 ,max: 50 }).trim().withMessage("Name  should be between 3 to 50 characters."),
    body("email", "Please enter valid email").if(body('email').exists()).trim().matches(REGX.Email),
    body("address", "Address is not allowed to be empty").if(body('address').exists()).trim()
      .notEmpty()
      .withMessage('Address not allowed to be empty').custom((value, { req }) => {
        if (value && (!req.body.latitude || !req.body.longitude)) {
            throw new Error('Latitude and Longitude must be provided if Address is filled');
        }
        return true;
    })
    

  ],
  
  login:[
    body("email", "Please enter email").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("password", "Password is not to be empty").exists().notEmpty()
  ],

  forgotPassword:[body("email", "Please enter valid email").exists().trim().notEmpty().matches(REGX.Email)],
    verifyEmail:[
      body("token","Token Required").exists().notEmpty(),
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
}