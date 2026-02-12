// DEPENDENCIES
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const axios = require("axios");
const util = require('util');
// USER DEFINED MIDDLEWARES
const catchAsync = require("../../../utility/catchAsync");
const { UserError } = require("../../../utility/error");
const { UnauthorizedError } = require("../../../utility/commonError");
const { statusCodes, userRole } = require("../../../utility/constant");
const AppError = require("../../../utility/appError");
const { decrypt } = require("../../../utility/encryption");
const otpGenerator = require("otp-generator");
const otpModel = require("../../../models/otpModel");
const passwordResetModel = require("../../../models/passwordResetModel");
const { sendOtpEmail } = require("../../../utility/email");
const authService = require("../../../service/apiv1Service/authService");
const categoryModel = require("../../../models/categoryModel");
const subcategoryModel = require("../../../models/subCategoryModel");
const bannerModel = require("../../../models/bannerModel");
const productModel = require("../../../models/productModel");
const faqModel = require("../../../models/faqModel");
const ourPromiseModel = require("../../../models/ourPromiseModel");
const newsletterModel = require("../../../models/newLetterModel");
const ourvisionModel = require("../../../models/valueVisionModel");

const saltRounds = 10;

// DATABASE MODEL
const userModel = require("../../../models/userModel");

// CREATING TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createDefaultAdmin = catchAsync(async (req, res, next) => {
  const adminUser = await userModel.findOne({ email: "admin1@yopmail.com", role: userRole.ADMIN });

  if (adminUser) {
    console.log("default admin exists.");
    return true;
  }
  await userModel.create({
    email: "admin1@yopmail.com",
    password: 'Admin@1234',
    first_name: "Admin",
    last_name: "Vyna",
    role: "admin"

  });
  console.log("default admin created.");
});

// SEND TOKEN
const createSendToken = (user, statusCode, res) => {
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
  user.deviceToken = undefined;
  user.isDeleted = undefined;

  res.status(statusCode).json({
    status: "success",
    //  message: "You have successfuly logged in",
    message: res.__("auth.success.login"),
    token,
    user,
  });
};

// CONTROLLERS
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) Check if user exists & password is correct

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(
      res.status(statusCodes.UNAUTHORIZED).json({
        status: false,
        // message: "Invalid Credentials.",
        message: res.__("auth.validation.invalidCreds")
      })
    );
  }
  if (user.role != "admin") {
    return next(
      res.status(statusCodes.UNAUTHORIZED).json({
        status: false,
        // message: "You are not admin. Please provide admin credential",
        message: res.__("provide_admin_credential"),
      })
    );
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      res.status(statusCodes.UNAUTHORIZED).json({
        status: false,
        // message: "Invalid Credentials",
        message: res.__("auth.validation.invalidCreds"),
      })
    );
  }
  createSendToken(user, 200, res);
});

exports.protact = catchAsync(async (req, res, next) => {
  try {
    // 1) Getting token and check it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new UserError(
        res.status(statusCodes.UNAUTHORIZED).json({
          status: false,
          // message: "You are not authorised to access this service",
          message: res.__("you_are_not_authorised"),
        })
      );

    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //req["body"]["userId"] = decoded.id;

    //  3) check if user still exists
    //console.log('======token--',token)

    const currentUser = await userModel.findById(decoded.id);
    //  console.log('====',currentUser)
    if (!currentUser) {
      throw new UnauthorizedError(
        res.status(statusCodes.UNAUTHORIZED).json({
          status: false,
          // message: "The user belonging to this token does no longer exist.",
          message: res.__("the_user_belonging"),
        })

      );
    }
    if (currentUser.role != 'admin') {
      throw new UnauthorizedError(
        res.status(statusCodes.UNAUTHORIZED).json({
          status: false,
          // message: "You are not authorised to access this service",
          message: res.__("you_are_not_authorised"),
        })
      );
    }

    axios.interceptors.request.use(function (request) {
      request.headers.Authorization = "Bearer" + token;
      return request;
    });
    // Grant Access to Protected route
    req.user = currentUser;
    next();
  } catch (error) {
     console.log("Unable to validate user", error);
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});
exports.protactBoth = catchAsync(async (req, res, next) => {
  try {
    // 1) Getting token and check it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    //console.log('========token--',token)
    if (!token) {
      throw new UserError(
        res.status(statusCodes.UNAUTHORIZED).json({
          status: false,
          // message: "You are not authorised to access this service",
          message: res.__("you_are_not_authorised"),
        })
      );

    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await userModel.findById(decoded.id);
    // console.log('currentUser--------',currentUser)
    if (!currentUser) {
      throw new UnauthorizedError(
        res.status(statusCodes.UNAUTHORIZED).json({
          status: false,
          // message: "The user belonging to this token does no longer exist.",
          message: res.__("the_user_belonging"),
        })

      );
    }

    axios.interceptors.request.use(function (request) {
      request.headers.Authorization = "Bearer" + token;
      return request;
    });
    // Grant Access to Protected route
    //console.log('currentUser----,currentUser=---',currentUser)
    req.user = currentUser;
    console.log(' req.user---', req.user)
    next();
  } catch (error) {
    console.log("Unable to validate user", error);
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    console.log('=====email==', req.body.email)
    const user = await userModel.findOne({ email: req.body.email, role: 'admin' });
    //    console.log('user--',user)
    if (user === null) {
      res.status(statusCodes.NOT_FOUND).json({
        status: "success",
        // message: "Please Use Registered Email Id",
        message: res.__("please_use_registered_email"),
      });
    }

    const OTP = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const email = req.body.email;

    const otp = { email: email, otp: OTP };
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otpModel.create(otp);

    console.log("email", email)
    console.log("OTP", OTP)

    let userTemplate = {
      email: email,
      otp: OTP,
    };
    console.log("userTemplate", userTemplate)
    await sendOtpEmail(userTemplate);

    res.status(statusCodes.CREATED).json({
      status: "success",
      // message: "otp send successfuly",
      message: res.__("otp_send"),
      otp: OTP,
    });
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});

exports.checkOtp = catchAsync(async (req, res, next) => {
  try {
    const otpHolder = await otpModel.find({ email: req.body.email });
    if (otpHolder.length === 0) {
      res.status(statusCodes.NOT_FOUND).json({
        status: "warning",
        // message: "you use an expire otp",
        message: res.__("otp_expired"),
      });
    }
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
    if (!validUser) {
      res.status(statusCodes.NOT_FOUND).json({
        status: "warning",
        // message: "You have enter wrong otp",
        message: res.__("wrong_otp"),
      });
    } else if (validUser) {
      let passwordResetToken = signToken(rightOtpFind._id);
      const passwordToken = {
        email: req.body.email,
        token: passwordResetToken,
      };
      let result = await passwordResetModel.create(passwordToken);

      const OTPDelete = await otpModel.deleteMany({
        email: req.body.email,
      });

      res.status(statusCodes.ACCEPTED).json({
        status: "success",
        // message: "Otp verified",
        message: res.__("otp_verified"),
        passwordResetToken: passwordResetToken,
      });
    }
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});




exports.getAdminProfile = catchAsync(async (req, res, next) => {
  try {
    const adminProfile = await userModel.findOne({ _id: req.user.id },
      { "isDeleted": 0, 'password': 0 });
    res.status(statusCodes.OK).json({
      status: "success",
      message: "Profile Details",
      data: adminProfile,
    });
  } catch (error) {
    console.log('error======', error)
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});

exports.resetPassword1 = catchAsync(async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const token = req.body.token;
    const password = req.body.password;

    console.log('---req.body-----------', req.body);

    // 1. Get latest password reset token for the email
    const getPasswordRestToken = await passwordResetModel.find({ email });

  //  console.log('==========get', getPasswordRestToken);

    if (getPasswordRestToken.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "warning",
        message: res.__("Invalid email"),
      });
    }

    // 2. Decrypt and verify token
    const decryptedEmail = await decrypt(token);

    if (decryptedEmail !== email) {
      return res.status(statusCodes.ACCEPTED).json({
        status: "warning",
        message: res.__("email_token_does_not_match"),
      });
    }

    // 3. Hash the new password
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // 4. Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "warning",
        message: res.__("user_not_found"),
      });
    }

    // 5. Update password
    await userModel.findOneAndUpdate(
      { email: email, _id: user._id },
      { password: hashedPassword },
      { new: true }
    );

    // 6. Delete all reset tokens for this email
    await passwordResetModel.deleteMany({ email });

    // 7. Respond success
    return res.status(statusCodes.ACCEPTED).json({
      status: "success",
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log('error ====== ', error);
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});



exports.updateAdmin = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;

    if (req.file) {
      body.avatar = req.file.location;
    }
    // console.log('avatar----', body.avatar)
    let updateAdmin = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      body,
      { new: true }
    );

    res.status(statusCodes.ACCEPTED).json({
      status: "Success",
      // message: "Profile Updated Successfully",
      message: res.__("profile_update_successfully"),
      data: updateAdmin,
    });
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});

exports.forgotPasswordLink = catchAsync(async (req, res, next) => {
  try {

    const user = await userModel.findOne({ email: req.body.email, role: 'admin' });
    if (user === null) {
      res.status(statusCodes.NOT_FOUND).json({
        status: "success",
        // message: "Please Use Registered Email Id",
        message: res.__("please_use_registered_email"),
      });
    }
    let data = await authService.sendEmailVerificationLink(req.body, user);

    res.status(statusCodes.CREATED).json(data);

  } catch (error) {
    throw new UserError(
      error,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});
exports.verifyForgotPassworEmail = catchAsync(async (req, res, next) => {
  try {
    let email = await decrypt(req.body.token);

    const user = await userModel.findOne({ email: email });
    if (!user) {

      res.status(statusCodes.UNAUTHORIZED).json({
        status: true,
        // message: "Invalid user verification request or link expired",
        message: res.__("invalid_user_verification_request"),
      });
    }

    const getDataEncryptedToken = await passwordResetModel.findOne({ 'email': email, 'encrypted_token': req.body.token });
    if (!getDataEncryptedToken || getDataEncryptedToken.isUsed) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        // message: "This reset link has expired or has already been used.",
        message: res.__("this_reset_link_has_expired_or_has_already_been_used"),
      });
    }

    // ✅ Mark token as used
    getDataEncryptedToken.isUsed = true;
    await getDataEncryptedToken.save();


    // console.log("user",user)
    let passwordResetToken = signToken(user._id);
    const passwordToken = {
      email: email,
      token: passwordResetToken,
    };
    // await passwordResetModel.create(passwordToken);
    await passwordResetModel.findOneAndUpdate(
      { email: email, encrypted_token: req.body.token },
      { token: passwordResetToken }
    );

    return res.send(statusCodes.ACCEPTED, {
      status: true,
      // message: "Email has been verified,please reset your password",
      message: res.__("email_has_been_verified"),
      data: passwordToken,
    })
    //.json();

  } catch (error) {
    throw new UserError(error.message, error.statusCode || statusCodes.INTERNAL_SERVER);
  }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    let reqObj = req.body.email
    //console.log('===============reqOBJ', reqObj)
    const user = await userModel.findOne({ email: reqObj.toLowerCase(), isDeleted: false, role: 'admin' });
    if (user === null) {
      res.status(statusCodes.EXPECTATION_FAILED).json({
        status: false,
        // message: "Email not found",
        message: res.__("email_not_found"),
      });
    }
    const getPasswordRestToken = await passwordResetModel.find({
      email: reqObj.toLowerCase(),
    });
    console.log('getPasswordRestToken---', getPasswordRestToken)
    if (getPasswordRestToken.length === 0) {
      res.status(statusCodes.EXPECTATION_FAILED).json({
        status: false,
        // message: "Invalid attempt to reset password",
        message: res.__("invalid_attempt_to_reset_password"),
      });
    }
    const rightPasswordRestToken =
      getPasswordRestToken[getPasswordRestToken.length - 1];

    await jwt.verify(
      req.body.token,
      process.env.JWT_SECRET,
      async (err, decode) => {
        if (err) {
          res.status(statusCodes.OK).json({
            status: "warning",
            // message: "Invalid attempt to reset password",
            message: res.__("invalid_attempt_to_reset_password"),
          });
        } else {
          if ("password" in req.body) {
            await bcrypt
              .hash(req.body.password, saltRounds)
              .then(function (hash) {
                req.body.password = hash;
              });
          }

          //await user.set( { password: req.body.password }).save();
          await userModel
            .findOneAndUpdate(

              { email: reqObj.toLowerCase(), _id: user.id },
              { password: req.body.password },
              { new: true }
            )
            .then();

          await passwordResetModel.deleteMany({ email: reqObj.toLowerCase() });
          res.status(statusCodes.ACCEPTED).json({
            status: "success",
            message: "Password reset successfully",
            //  message: res.__("password_reset_password"),

          });
        }
      }
    );
  } catch (error) {
    console.log('=========ERROR====', error)
    throw new UserError(error.message, error.statusCode || statusCodes.INTERNAL_SERVER);
  }
});



// method to get listing counts


exports.getDashboardListing = catchAsync(async (req, res, next) => {
  try {

    const categoryCount = await categoryModel.countDocuments({ 'isDeleted': false });
    const subcategoryCount = await subcategoryModel.countDocuments({ 'isDeleted': false });
    const bannerCount = await bannerModel.countDocuments();
    const productCount = await productModel.countDocuments({ 'isDeleted': false });
    const faqCount = await faqModel.countDocuments();
    const ourPromiseCount = await ourPromiseModel.countDocuments({ 'isDeleted': false });
    const newsletterCount = await newsletterModel.countDocuments({ 'isDeleted': false });
    const ourvisionCount = await ourvisionModel.countDocuments({ 'isDeleted': false });

    res.status(statusCodes.OK).json({
      status: "success",
      // message: "Dashboard Details",
      message: res.__("dashboard_details"),
      categoryCount,
      subcategoryCount,
      bannerCount,
      productCount,
      faqCount,
      ourPromiseCount,
      newsletterCount,
      ourvisionCount
    });
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
});


exports.changePassword = catchAsync(async (req, res, next) => {
  let userId = req.user.id;
  console.log("4567890", userId)
  let old_password = req.body.old_password;
  //await userModel.findOne({ email }).select("+password");
  let user = await userModel.findById(userId);
  if (!user) {
    res.status(statusCodes.NOT_FOUND).json({
      status: false,
      // message: "User not found",
      message: res.__("user_not_found"),
    });
  }
  if (!(await user.correctPassword(old_password, user.password))) {

    return next(
      res.status(statusCodes.NOT_FOUND).json({
        status: false,
        // message: "Incorrect old password",
        message: res.__("incorrect_old_password"),
      })
    );

  }
  let newPassword = await authService._encryptPassword(req.body.password);
  await userModel.findByIdAndUpdate(userId, { password: newPassword });
  user.password = undefined;
  user.isDeleted = undefined;
  res.status(statusCodes.ACCEPTED).json({
    status: true,
    // message: "Password Changed Successfully",
    message: res.__("change_password"),
    data: user,
  });


});
