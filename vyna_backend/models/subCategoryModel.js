const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const user = require("./userModel");
const category = require("./categoryModel");

const subCategorySchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: category
    },
    subCategory_banner: {
      type: String
    },
    subCategory_mobile_banner: {
      type: String
    },
    sequence: {
      type: Number
    },
    image: {
      type: String
    },
    subCategoryName: {
      type: String
    },
    file: {
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

module.exports = mongoose.model("sub_category", subCategorySchema);
