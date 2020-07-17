const multer = require("multer");

const multerS3 = require("multer-s3");

const AWS = require("aws-sdk");

const {
  v4
} = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-northeast-2"
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "frisk/upload",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, v4());
    }
  })
});
exports.uploadMiddleware = upload.single("file");

exports.uploadController = (req, res) => {
  const {
    file: {
      location
    }
  } = req;
  res.json(location);
};