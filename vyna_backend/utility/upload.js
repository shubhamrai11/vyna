// NOTE: This local upload utility is unused — all routes use uploadAWS.js (S3).
// Kept for local development reference only.
const multer = require("multer");

const filestorage = multer.diskStorage({
  destination: "./utility/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage: filestorage });

module.exports = upload;
