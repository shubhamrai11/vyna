const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const faqAskQuesSchema = new Schema(

    {
        name: {
            type: String,
            require: true
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


module.exports = mongoose.model("faqAskQues", faqAskQuesSchema);