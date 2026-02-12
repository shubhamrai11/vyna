const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const passwordResetSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      // required: true,
    },
    encrypted_token : {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
  },
  { timestamps: true }
);

passwordResetSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

passwordResetSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

// userSchema.plugin(uniqueValidator);

const passwordResetModel = mongoose.model(
  "password_reset",
  passwordResetSchema
);

module.exports = passwordResetModel;
