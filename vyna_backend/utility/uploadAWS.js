// utility/upload.js
const path = require("path");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.SECRECT_KEY,
  accessKeyId: process.env.Access_KEY,
  region: process.env.REGION,
});

const s3 = new aws.S3();

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
