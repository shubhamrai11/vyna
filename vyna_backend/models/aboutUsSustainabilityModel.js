const mongoose = require("mongoose");
const { Schema } = mongoose;
const users = require("./userModel");

const aboutUsSustainabilitySchema = new Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    image :{
      type: String
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

module.exports = mongoose.model("aboutUs_sustainability", aboutUsSustainabilitySchema);
