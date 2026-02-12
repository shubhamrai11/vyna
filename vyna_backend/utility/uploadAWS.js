// utility/uploadAWS.js — AWS SDK v3 (lightweight, Vercel-compatible)
const path = require("path");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: process.env.REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.Access_KEY,
    secretAccessKey: process.env.SECRECT_KEY,
  },
});

const uploadFile = (type) => {
  let bucketName = process.env.S3BUSCKET;
  try {
    if (type === "file") {
      bucketName = process.env.S3BUSCKET;
    } else {
      throw new Error("Invalid type for AWS S3 service");
    }

    const fileStorage = multerS3({
      s3: s3,
      bucket: bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,

      metadata: function (req, file, cb) {
        console.log('file-to-upload---',file)
        cb(null, {
          fileName: file.originalname,
          mimetype: file.mimetype,
        });
      },
      key: function (req, file, cb) {
        let uploadedFileName =
          file.fieldname + Date.now() + path.extname(file.originalname);
        cb(null, uploadedFileName);
      },
    });

    return multer({ storage: fileStorage });
  } catch (error) {
    throw error;
  }
};

module.exports = uploadFile;
