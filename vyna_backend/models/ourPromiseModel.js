const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const users = require("./userModel");

const pointSchema = new mongoose.Schema({
  icon: { type: String, required: true }, 
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description:{ type: String, required: true }
});

const ourPromiseSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "What Sets Us Apart"
    },
    title : {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    points: {
      type: [pointSchema],
      required: true
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

module.exports = mongoose.model("our_promise", ourPromiseSchema);
