const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const contactusSchema = new Schema(

    {
        title: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        website_url : {
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
        }
    },
    
    { timestamps: true }
);


module.exports = mongoose.model("contactus", contactusSchema);