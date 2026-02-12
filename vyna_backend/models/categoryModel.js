const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const user = require("./userModel");

const categorySchema = new Schema(
  {
    category_name: {
      type: String
    },
    category_banner: {
      type: String
    },
    category_mobile_banner: {
      type: String
    },
    category_image: {
      type: String
    },
    category_logo: {
      type: String
    },
    image: {
      type: String
    },
    category_description: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
      ref: user
    },
    updatedBy: {
      type: mongoose.ObjectId,
      ref: user
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
