const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes, userRole } = require("../../utility/constant");
const userModel = require("../../models/userModel");
// const jobseekerProfileModel = require("../../models/jobseekerProfileModel");
const jobPostingModel = require("../../models/jobPostingModel");
const jobapplyModel = require("../../models/jobApplyModel");
const otpModel = require("../../models/otpModel");
const { sendPasswordApplicant } = require("../../utility/email");
const otppppppppp = require("../../middleWare/otp");
const { sendPasswordUser } = require("../../utility/email");
const mongoose = require("mongoose");
const i18n = require("../../translation");

exports.create = async (userBody,res) => {
  try {
    const userData = await userModel.findOne({
      email: userBody.email,
      isDeleted: false,
    });
    if (userData !== null) {
      return {
        status: false,
        // message: "Email ID already exists"
        message: res.__("email_ID_already_exists"),
      };
    }
    // Generate random password
    let randomstring = Math.random().toString(36).slice(-8);
    console.log("Generated Password:", randomstring);

    // Convert email to lowercase
    userBody.email = userBody.email.toLowerCase();

    // User fields
    const userFields = {
      first_name: userBody.first_name,
      last_name: userBody.last_name,
      mobileNumber: userBody.mobileNumber,
      // avatar: userBody.avatar,
      is_verify: true,
      otp: null,
      createdBy: userBody.createdBy,
      email: userBody.email,
      password: randomstring,
      role: userRole.JOBSEEKER, // Ensure role is set
      add_by_recruiter: true,
    };

    let user = await userModel.create(userFields);

    const id = user._id;

    const profileFields = {
      user_id: id,
      location: userBody.location,
      // linkedinProfile: userBody.linkedin_profile,
      resume: userBody.resume || "",
      // certificate: userBody.certificate,
      skills: userBody.skills,
      // job_preferences_location: userBody.job_preferences_location,
      // type: userBody.type,
      experience: userBody.experience,
      // salaryRange: userBody.salaryRange,
      // privacy_setting: userBody.privacy_setting,
    };

    await jobseekerProfileModel.create(profileFields);

    // const jobpostingFields = {
    //     job_title: userBody.job_title,
    //     job_location: userBody.job_location,
    //     salary: userBody.salary,
    //     application_deadline: userBody.application_deadline,
    //     interviewer: userBody.interviewer,
    //     // department: userBody.department,
    //     required_skills: userBody.required_skills,
    //     job_description: userBody.job_description,
    //     currentStage: userBody.currentStage,
    //     company_name : userBody.company_name
    // };

    // let jobposting = await jobPostingModel.create(jobpostingFields);
    // const job_posting_id = jobposting._id;

    console.log("87261545", userBody.job_id);

    const jobapplyFields = {
      jobId: userBody.job_id,
      createdBy: id,
    };
    console.log("mewwww", jobapplyFields);
    await jobapplyModel.create(jobapplyFields);

    // Send email with credentials
    let userTemplate = {
      email: userBody.email,
      password: randomstring,
    };

    await sendPasswordApplicant(userTemplate);

    return {
      statusCode: statusCodes.CREATED,
      status: "success",
      // message: `Applicant created successfully`,
      message: res.__("applicant_created"),
    };
  } catch (error) {
    // console.log("84767536457357534543354",error)
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};
