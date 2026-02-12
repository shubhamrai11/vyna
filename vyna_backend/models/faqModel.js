const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const FaqSchema = new Schema(
    {
        question: {
        type: String,
        required: false
        },
        answer :{
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

FaqSchema.plugin(uniqueValidator);

module.exports = mongoose.model("faq", FaqSchema);
