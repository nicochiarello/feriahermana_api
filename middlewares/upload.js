const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: "AKIA6HK2ZBTX6HAF54SA",
  secretAccessKey: "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",
  ACL: "public-read",
});

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "feria-hermana",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});
