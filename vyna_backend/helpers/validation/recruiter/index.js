const { body, validationResult } = require('express-validator');
const { REGX } = require("../../../utility/constant");


module.exports = {
  create_user: [
    body("first_name", "First Name is required").exists().isLength({ min: 3, max: 50 }).trim().withMessage("First Name should be between 3 to 50 characters."),
    body("last_name", "Last Name is required").exists().isLength({ min: 3, max: 50 }).trim().withMessage("Last Name should be between 3 to 50 characters."),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    // body("password", "Please enter password").exists().notEmpty(),
  ],

  CreateJob: [
    body("job_title", "Job Title is required").exists().isLength({ min: 3, max: 500 }).trim().withMessage("Job Title should be between 3 to 75 characters."),
    body("job_location", "Job Location is required").exists().isLength({ min: 3, max: 200 }).trim().withMessage("Job Location should be between 3 to 100 characters."),
    body("company_name", "Comapny Name is required").exists().isLength({ min: 3, max: 500 }).trim().withMessage("Comapnay Name should be between 3 to 75 characters."),
    body("salary").optional(),
    body("application_deadline", "Application Deadline is required").exists().notEmpty(),
    body("interviewer", "Interviewer is required").exists().notEmpty(),
    // body("department", "department is required ").exists().notEmpty(),

    body("job_description", "Job Description is required ").exists().isLength({ min: 3, max: 5000 }).trim().withMessage("Job Description should be between 3 to 500 characters."),

    body("required_skills", "Required Skills is required ").exists().notEmpty(),
    // body("password", "Please enter password").exists().notEmpty(),
  ],

  login: [
    body("email", "Please enter email").exists().trim().notEmpty(),
    body("email", "Please enter valid email").exists().trim().matches(REGX.Email),
    body("password", "Password is not to be empty").exists().notEmpty()
  ],

  update_profile: [
    body("first_name", "First Name is required").exists().isLength({ min: 3, max: 50 }).withMessage("Name  should be between 3 to 50 characters."),
    body("last_name", "Last Name is required").exists().isLength({ min: 3, max: 50 }).withMessage("Name  should be between 3 to 50 characters."),
  ],
  forgotPassword: [body("email", "Please enter valid email").exists().trim().notEmpty().matches(REGX.Email)],
  verifyEmail: [
    body("token", "Token Required").exists().notEmpty(),
  ],

  reset_password: [
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