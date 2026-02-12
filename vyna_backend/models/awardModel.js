const mongoose = require("mongoose");
const { Schema } = mongoose;
const users = require("./userModel");

const imageSchema = new Schema(
  {
    url: { type: String, required: [true, "Image URL is required"] }
  },
  { _id: true } 
);

const sideimageSchema = new Schema(
  {
    url: { type: String, required: [true, "Image URL is required"] }
  },
  { _id: true }
);

const awardSchema = new Schema(
  {
    heading: {
      type: String
    },
    description: {
      type: String
    },
    award_image :{
      type: String
    },
    image: [imageSchema],
    side_image: [sideimageSchema],
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

module.exports = mongoose.model("award", awardSchema);
