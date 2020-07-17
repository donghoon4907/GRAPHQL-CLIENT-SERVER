"use strict";

var multer = require("multer");

var multerS3 = require("multer-s3");

var AWS = require("aws-sdk");

var _require = require("uuid"),
    v4 = _require.v4;

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-northeast-2"
});
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "frisk/upload",
    acl: "public-read",
    metadata: function metadata(req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function key(req, file, cb) {
      cb(null, v4());
    }
  })
});
exports.uploadMiddleware = upload.single("file");

exports.uploadController = function (req, res) {
  var location = req.file.location;
  res.json(location);
};