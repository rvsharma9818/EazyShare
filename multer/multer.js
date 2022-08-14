const aws = require("aws-sdk");

const multer = require("multer");

const uuid = require("uuid").v4;

const multerS3 = require("multer-s3");

require("dotenv").config({
  path:'.env'
})



// config a AWS S3 services

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// config a multer 

exports.upload = multer({
  storage: multerS3({
    s3,
    ACL: "public-read",
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${uuid()}-${file.originalname}`);
    },
  }),
  limits: { files: 1 },
});
