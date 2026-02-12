const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const user = require("./userModel");
 
const imageSchema = new Schema(
  {
    url: { type: String, required: [true, "Image URL is required"] }
  },
  { _id: true }
);


const homeWhoWeAreSchema = new Schema(
  {
    image: [imageSchema],
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.ObjectId,
 
      ref: user,
    },
    updatedBy: {
      type: mongoose.ObjectId,
      ref: user
    }
  },
  { timestamps: true }
);
 

module.exports = mongoose.model("home_who_we_are", homeWhoWeAreSchema);
 
 