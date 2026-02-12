const mongoose = require("mongoose");
const { Schema } = mongoose;

const uniqueValidator = require("mongoose-unique-validator");
const users = require("./userModel");

const valueVisionSchema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    },
    icon: {
      type: String,
      default: []
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
      ref: users
    },
    updatedBy: {
      type: mongoose.ObjectId,
      ref: users
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("value_vision", valueVisionSchema);
