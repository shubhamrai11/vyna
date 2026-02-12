const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

otpSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

otpSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

otpSchema.plugin(uniqueValidator);

const otpModel = mongoose.model("otps", otpSchema);

module.exports = otpModel;
