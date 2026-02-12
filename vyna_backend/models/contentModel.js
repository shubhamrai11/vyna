const mongoose = require("mongoose");
const { Schema } = mongoose;

const uniqueValidator = require("mongoose-unique-validator");
const contentSchema = new Schema(

    {
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        image: {
            type: [String],
            default: []
        },
        role: {
            type: String,
            enum: ["Privacy Policy", "Terms and Conditions"],
            required: false,
        },
    },
    
    { timestamps: true }
);


module.exports = mongoose.model("content", contentSchema);