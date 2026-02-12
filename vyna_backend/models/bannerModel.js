const mongoose = require("mongoose");
 
const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
       role: {
      type: String,
      enum: ["mobile", "tab", "laptop"],
    },
     sequence: {
      type: Number
    },
  },

  { timestamps: true }
);
 
module.exports = mongoose.model("banners", bannerSchema);
 