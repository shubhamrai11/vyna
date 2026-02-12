const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

// MIDDLEWARES
dotenv.config({ path: "./config.env" });

aws.config.update({
  secretAccessKey: process.env.NODE_ENV.Access_KEY,
  accessKeyId: process.env.NODE_ENV.SECRECT_KEY,
  region: process.env.NODE_ENV.S3BUSCKET,
});

// ========================
const filestorage = multer.diskStorage({
  destination: "./utility/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage: filestorage });

module.exports = upload;
