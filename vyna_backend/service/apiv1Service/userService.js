const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes, userRole } = require("../../utility/constant");
const userModel = require("../../models/userModel");
// const jobseekerProfileModel = require("../../models/jobseekerProfileModel");
const otpModel = require("../../models/otpModel");
const { sendOtpEmail } = require("../../utility/email");
const otppppppppp = require("../../middleWare/otp");
const { sendPasswordUser } = require("../../utility/email");
const mongoose = require('mongoose')
const i18n = require("../../translation")


async function generateEmployeeCode() {
  const totalDocCount = await await userModel.countDocuments({ role: { $ne: "admin" } });
  const formattedNumber = (totalDocCount + 1).toString().padStart(5, '0'); // Adjusted to 5 digits
  const employeeCode = `AIRSAT${formattedNumber}`;

  return employeeCode;
}

exports.getAllUser = async (pagination) => {
  // let query = userModel.find().sort({ updatedAt: -1 });
  let query = userModel
    .find({ role: { $nin: ["admin", "subAdmin"] }, isDeleted: false })
    .sort({ updatedAt: -1 }).populate('createdBy').populate('updatedBy');
  const page = pagination.currentPage;
  const limit = pagination.docPerPageCount * 1 || 50;
  const skip = page * limit;

  query = query.skip(skip).limit(limit);
  // pagination.totalDocCount = await userModel.countDocuments();
  pagination.totalDocCount = await userModel.countDocuments({
    role: { $ne: "admin", $ne: "subAdmin" },
  });

  if (pagination.totalCount === 0) {

    return {
      status: true,
      // message: "No Records Found",
      message: i18n.__("no_record_found"),
      data: [],
      meta: {
        pagination: pagination,
        field: "createdAt",
        rowIds: "",
      },
    };
  }


  pagination.totalPageCount = Math.ceil(pagination.totalCount / limit);
  if (page > pagination.totalPageCount) {
    throw new PageNotFoundError("This page dose not exist");
  }

  let user;
  user = await query;
 // console.log("record found");

  return {
    status: "success",
    // message: "Got All User",
    message: i18n.__("all_user"),
    users: user,
    meta: {
      pagination: pagination,
      field: "createdAt",
      rowIds: "",
    },
  };
};

exports.create = async (body,res) => {
  try {
    const userData = await userModel.findOne({ email: body.email, isDeleted: false });
    if (userData !== null) {
      return {
        status: false,
        // message: "Email ID already exists"
        message: res.__("email_ID_already_exists")
      };
    }

    body.role = userRole.JOBSEEKER;
    var randomstring = Math.random().toString(36).slice(-8);
   // console.log("8765638627357273",randomstring)
    body.password = body.password;

   // console.log('email--',body.email)
    body.email = body.email.toLowerCase()
    // console.log("bodyyyyyyyy",body);
    // body.empNumber = await generateEmployeeCode();
    let user = await userModel.create(body).then();
    const otp = await otppppppppp.generateOtp(body.email);
  //  console.log("62677",otp)
    let userTemplate = {
      email: body.email,
      otp: otp.OTP,
    };

    await sendOtpEmail(userTemplate);
    return {
        statusCode: statusCodes.CREATED,
        status: "success",
        // message: `Otp send successfully`,
        message: res.__("otp_send"),
        otp: otp.OTP,
      };

  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.verifyOtp = async (body,res) => {
  try {
    let emailInfo = await userModel.find({ email: body.email });
    if (!emailInfo.length) {
      return { success: false, 
        // message: "Email not found." 
        message: res.__("email_not_found")
      };
    }
    if (emailInfo[0].otp !== body.otp) {
      return { success: false, 
        // message: "Please enter a valid OTP." 
        message: res.__("valid_otp")
      };
    }

    let userId = emailInfo[0]._id;
    let updateObj = { is_verify: true, otp: null };
    let updatedUser = await userModel.findByIdAndUpdate(userId, updateObj, { new: true });

    if (!updatedUser) {
      return { success: false, 
        // message: "Failed to verify email." 
        message: res.__("failed_verify_email")
      };
    }

    return { statusCode: statusCodes.CREATED, status: "success", 
    // message: "Your account has been successfully verified!", 
    message: res.__("account_verified"),
    data: updatedUser };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};


exports.resendOtp = async (body,res) => {
  try {
    let emailInfo = await userModel.find({ email: body.email });
    if (!emailInfo.length) {
      return { success: false, 
        // message: "Email not found." 
        message: res.__("email_not_found")
      };
    }
    const newOtp = await otppppppppp.generateOtp(body.email);
    // let newOtp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    let userTemplate = {
      email: body.email,
      otp: newOtp.OTP,
    };

    await sendOtpEmail(userTemplate);

    let updateObj = { otp: newOtp.OTP };
    let updatedUser = await userModel.findByIdAndUpdate(emailInfo[0]._id, updateObj, { new: true });

    if (!updatedUser) {
      return { success: false, 
        // message: "Failed to resend OTP." 
        message: res.__("failed_otp")
      };
    }

    return { statusCode: statusCodes.OK, status: "success", 
    // message: "OTP has been resent successfully!", 
    message: res.__("resent_otp"),
    data: { otp: newOtp.OTP }, };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};


exports.getByID = async (id,res) => {
  try {
//console.log("1", i18n.t("get_jobseeker"));
// console.log("2",i18n.__("get_jobseeker"))
  //  console.log('-id--',id)
    const userData = await userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "jobseekerprofiles",
          localField: "_id",
          foreignField: "user_id",
          as: "JobseekerProfile",
        },
      },
      { $unwind: { path: "$JobseekerProfile", preserveNullAndEmptyArrays: true } },
    
      // Lookup for skills
      {
        $lookup: {
          from: "skills",
          localField: "JobseekerProfile.skills",
          foreignField: "_id",
          as: "JobseekerProfile.skills",
        },
      },
    
      // Lookup for job preferences location
      {
        $lookup: {
          from: "locations",
          localField: "JobseekerProfile.job_preferences_location",
          foreignField: "_id",
          as: "JobseekerProfile.job_preferences_location",
        },
      },
    
      // Lookup for salary range
      {
        $lookup: {
          from: "salaryranges",
          localField: "JobseekerProfile.salaryRange",
          foreignField: "_id",
          as: "JobseekerProfile.salaryRange",
        },
      },
    ]);
    
    console.log("User Data: ", userData);
    
    
    if (userData.length === 0) {
      return { 
        // message: "User not found" 
        // message: i18n.__("user_not_found")
       message: res.__("user_not_found")
      };
    }
console.log('=============userData===',userData)
    
   // let user = await userModel.findById(id).populate('createdBy').populate('updatedBy').then();
    // if (user === null || user.isDeleted) {
    //   throw new UserNotFoundError("User not found");
    // }
    return {
      status: "success",
      // message: `Get Jobseeker List`,
      // message: i18n.t("get_jobseeker"),
      message: res.__("get_jobseeker"),
      user: userData,
    };
  } catch (error) {

    console.log('===error==',error)
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.updateUser = async (id, userBody,res) => {
  try {
    let user = await userModel.findById(id);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    console.log("72763762",userBody)
    const userFields = {
      first_name: userBody.first_name,
      last_name: userBody.last_name,
      country_code : userBody.country_code,
      mobileNumber: userBody.mobileNumber,
      avatar: userBody.avatar,
      updatedBy: userBody.updatedBy,
      "is_profile_completed" : true
    };

    
    user = await userModel.findByIdAndUpdate(id, userFields, { new: true });


    const profileFields = {
      user_id: id,
      location: userBody.location,
      linkedin_profile: userBody.linkedin_profile,
      resume: userBody.resume,
      certificate: userBody.certificate,
      skills: userBody.skills,
      job_preferences_location: userBody.job_preferences_location,
      type: userBody.type,
      experience: userBody.experience,
      salaryRange: userBody.salaryRange,
      privacy_setting : userBody.privacy_setting,
    };


    await jobseekerProfileModel.findOneAndUpdate(
      { user_id: id },
      profileFields,
      { new: true, upsert: true }
    );

    return {
      status: true,
      // message: "Profile updated successfully",
      message: res.__("profile_update_successfully"),
      // user: user,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.deleteUser = async (id) => {
  try {
    let user = await userModel.findById(id);
    if (user === null) {
      throw new UserNotFoundError("User Does Not Exists");
    }
    user.set({ isDeleted: true }).save();
    return {
      status: "success",
      // message: "Data Deleted Successfully"
      message: i18n.__("data_deleted")
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};



exports.dashboardDetails = async () => {
  try {
    const userCount = await userModel.countDocuments({ role: 'user', 'isDeleted': false });
    const assetDetailCount = await assetseModel.countDocuments();
    const assetsCount = await assetsTypeModel.countDocuments();
    const projectCount = await projectModel.countDocuments({ 'isDeleted': false });
    const taskCount = await taskModel.countDocuments();
    const leaveCount = await leaveModel.countDocuments();
    const contentCount = await contentModel.countDocuments();
    const subAdminCount = await userModel.countDocuments({ role: 'subAdmin', 'isDeleted': false });
    const assetLocationCount = await assetLocationModel.countDocuments({'isDeleted': false });

    return {
      status: true,
      message: "Data get successfully",
      userCount,
      assetDetailCount,
      assetsCount,
      projectCount,
      taskCount,
      leaveCount,
      contentCount,
      subAdminCount,
      assetLocationCount
    };

  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};



// method to logout user 


exports.userLogout = async (id,res) => {
  try {
 //   console.log('id---',id)
    let user = await userModel.findById(id);
    if (user === null) {
      throw new UserNotFoundError("User Does Not Exists");
    }
    user.set({deviceToken:null}).save()
    return {
      status: "success",
      // message: "User Logout Successfully"
      message: res.__("user_logout")
    };
  } catch (error) {
    console.log('=====error==',error)
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};