const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  qrCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QRCode", QRCodeSchema);
