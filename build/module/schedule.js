"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var schedule = require("node-schedule");

var fs = require("fs");

var path = require("path");

var _require = require("../../generated/prisma-client"),
    prisma = _require.prisma;

var _require2 = require("./file"),
    generateTranscodeVideo = _require2.generateTranscodeVideo;

var _require3 = require("./s3client"),
    upload = _require3.upload;

exports.executeTranscode = function () {
  schedule.scheduleJob("30 * * * * *", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var videos;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return prisma.posts({
              where: {
                video: {
                  status: "queue"
                }
              }
            }).video();

          case 2:
            videos = _context3.sent;
            console.log("TRANSCODING START: GET TARGET");
            videos.forEach( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
                var video;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        video = _ref2.video;
                        Object.keys(video).forEach( /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(key) {
                            var _key$split, _key$split2, _, resolution, transcoded, location, _data;

                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    if (video[key]) {
                                      _context.next = 13;
                                      break;
                                    }

                                    _key$split = key.split("_"), _key$split2 = (0, _slicedToArray2["default"])(_key$split, 2), _ = _key$split2[0], resolution = _key$split2[1];
                                    _context.next = 4;
                                    return generateTranscodeVideo({
                                      url: video.url,
                                      resolution: resolution
                                    });

                                  case 4:
                                    transcoded = _context.sent;

                                    if (!transcoded) {
                                      _context.next = 13;
                                      break;
                                    }

                                    _context.next = 8;
                                    return upload({
                                      filename: transcoded.filename,
                                      fileStream: transcoded.fileStream
                                    });

                                  case 8:
                                    location = _context.sent;

                                    if (!location) {
                                      _context.next = 13;
                                      break;
                                    }

                                    _context.next = 12;
                                    return prisma.updateVideo({
                                      data: (_data = {}, (0, _defineProperty2["default"])(_data, key, location), (0, _defineProperty2["default"])(_data, "status", key === "url_1080p" ? "complete" : "working"), _data),
                                      where: {
                                        id: video.id
                                      }
                                    });

                                  case 12:
                                    // 파일 삭제
                                    fs.unlinkSync(path.join(__dirname, "../public/videos/".concat(transcoded.filename)));

                                  case 13:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x2) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x) {
                return _ref3.apply(this, arguments);
              };
            }());
            console.log("TRANSCODING END");

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
};