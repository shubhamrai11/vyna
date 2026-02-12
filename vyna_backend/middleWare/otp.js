const otpGenerator = require("otp-generator");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { userLogout } = require("../controller/apiv1Controller/frontend/userController");
const userModel = require("../models/userModel");

const generateOtp = async (userEmail) => {
  // const OTP = otpGenerator.generate(4, {
  //   type: "numeric",
  //   // digits: true,
  //   // alphabets: false,
  //   // upperCase: false,
  //   // specialChars: false,
  // });
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * 4);
    OTP += digits[randomIndex];
  }
  
  const email = userEmail;


  // const result = await otpModel.create(otp);
  const result = await userModel.findOneAndUpdate(
    { email: email , isDeleted:false}, // Query condition
    { $set: { otp: OTP } }, // Correct usage of $set
    { new: true } // Returns the updated document
  );
  
  return {
    OTP,
  };
}

const compareOtp = async (userEmail, otp) => {
  const otpHolder = await otpModel.find({ email: userEmail });
  console.log("1111111111111", otpHolder);
  if (otpHolder.length === 0) {
    return {
      status: "warning",
      message: "you use an expire otp",
    };
  }
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(otp, rightOtpFind.otp);
  return { rightOtpFind, validUser };
};

module.exports = { generateOtp, compareOtp };
