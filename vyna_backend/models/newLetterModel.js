const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const user = require("./userModel");
const validator = require("validator");

const newLetterSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (email) {
          // Use the validator library for email validation
          return validator.isEmail(email);
        },
        message: "Invalid email format"
      }
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.ObjectId,
    //   required: true,
    //   ref: user
    },
    updatedBy: {
      type: mongoose.ObjectId,
      ref: user
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("new_letter", newLetterSchema);
