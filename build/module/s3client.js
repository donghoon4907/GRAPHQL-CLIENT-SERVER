"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var AWS = require("aws-sdk");

var config = {
  bucketName: "frisk/transcoded",
  bucketRegion: "ap-northeast-2",
  identifyPoolId: "ap-northeast-2:ebf9cb6b-be96-46e2-a26f-e7fe7608bc80"
};
AWS.config.update({
  region: config.bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.identifyPoolId
  })
}); // Create S3 service object

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {
    Bucket: "".concat(config.bucketName, "/video")
  }
});

exports.upload = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var filename, fileStream, uploadParams, _yield$s3$upload$prom, Location;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filename = _ref.filename, fileStream = _ref.fileStream;
            uploadParams = {
              Key: filename,
              Body: fileStream,
              ACL: "public-read"
            }; // call S3 to retrieve upload file to specified bucket

            _context.prev = 2;
            _context.next = 5;
            return s3.upload(uploadParams).promise();

          case 5:
            _yield$s3$upload$prom = _context.sent;
            Location = _yield$s3$upload$prom.Location;
            return _context.abrupt("return", Location);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            console.error("upload error in s3 bucket");
            return _context.abrupt("return", false);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 10]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports["delete"] = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var filename, param;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filename = _ref3.filename;
            param = {
              Key: filename
            };
            _context2.prev = 2;
            _context2.next = 5;
            return s3.deleteObject(param).promise();

          case 5:
            return _context2.abrupt("return", true);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](2);
            console.error("delete error in s3 bucket");
            return _context2.abrupt("return", false);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 8]]);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}();