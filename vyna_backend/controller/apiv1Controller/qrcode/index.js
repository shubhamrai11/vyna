const QRCode = require('qrcode');
const QRCodeModel = require('../../../models/qrCodeModel');

exports.generateAndSaveQRCode = async (req, res) => {
  try {
    const websiteURL = req.body.url;
    // console.log("websiteURL",websiteURL);

    // QR code generate
    const qrDataUrl = await QRCode.toDataURL(websiteURL);

    // Database mei save
    const qr = new QRCodeModel({
      url: websiteURL,
      qrCode: qrDataUrl
    });

    await qr.save();

    res.json({
      success: true,
      message: "QR Code generated and saved",
      data: qr
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};