"use strict";

var fs = require("fs");

var path = require("path");

var ffmpeg = require("fluent-ffmpeg");

var _require = require("uuid"),
    v4 = _require.v4; // transcoding video


exports.generateTranscodeVideo = function (_ref) {
  var url = _ref.url,
      resolution = _ref.resolution;
  var uuid = v4();
  var size;

  switch (resolution) {
    case "360p":
      size = "480x360";
      break;

    case "480p":
      size = "858x480";
      break;

    case "720p":
      size = "1280x720";
      break;

    case "1080p":
      size = "1920x1080";
      break;

    default:
      size = "352x240";
      break;
  }

  return new Promise(function (resolve, reject) {
    var output = path.join(__dirname, "../public/videos/".concat(uuid, ".mp4"));
    ffmpeg().input(url).output(output).videoCodec("libx264").noAudio().format("mp4").size(size).on("end", function (_) {
      var fileStream = fs.readFileSync(output);
      resolve({
        fileStream: fileStream,
        filename: "".concat(uuid, ".mp4")
      });
    }).on("progress", function (progress) {
      console.log("".concat(resolution, ": ").concat(progress.percent, "%"));
    }).on("error", function (err) {
      console.log(err);
      reject(null);
    }).run();
  });
};