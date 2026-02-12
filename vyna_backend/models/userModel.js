const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, " First Name is required"],
    },
    last_name: {
      type: String,
      required: [true, " Last Name is required"],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (email) {
          // Use the validator library for email validation
          return validator.isEmail(email);
        },
        message: "Invalid email format",
      },
    },
    country_code : {
      type: String,
      default: '' 
    },
    mobileNumber: {
      type: String,
      default: '' 
    },
    avatar: {
      type: String,
      default: '' 

    },

    
    deviceToken: {
      type: String,
      default: '' 

    },
    
    deleteToken: {
      type: String,
      default: '' 

    },
    is_accept: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",

    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",

    },

    add_by_recruiter: {
      type: Boolean,
      default: false
  },

  is_profile_completed : {
    type: Boolean,
      default: false
  },

    otp: String,
		otpExpiration: Date,
		is_verify: {
			type: Boolean,
			default: false,
		},

  },
  { timestamps: true }
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', function (next) {
  let user = this;
  let salt = 8;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(salt, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.pre("save", function (next) {
  Object.keys(this.toObject()).forEach((key) => {
    if (this[key] === null) {
      this[key] = ""; // Null ko blank string me convert karna
    }
  });
  next();
});

userSchema.plugin(uniqueValidator);
const userModel = mongoose.model("users", userSchema);


module.exports = userModel;