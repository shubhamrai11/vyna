const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const contactUsFormSchema = new Schema(

    {
        name: {
            type: String,
            require: true
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
        mobile_number : {
            type: String,
            require: true
        },
        message: {
            type: String,
            require: true
        }
    },
    
    { timestamps: true }
);


module.exports = mongoose.model("contactUs_formData", contactUsFormSchema);