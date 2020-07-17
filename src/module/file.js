const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { v4 } = require("uuid");

// transcoding video
exports.generateTranscodeVideo = ({ url, resolution }) => {
  const uuid = v4();

  let size;
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

  return new Promise((resolve, reject) => {
    const output = path.join(__dirname, `../public/videos/${uuid}.mp4`);

    ffmpeg()
      .input(url)
      .output(output)
      .videoCodec("libx264")
      .noAudio()
      .format("mp4")
      .size(size)
      .on("end", function(_) {
        const fileStream = fs.readFileSync(output);
        resolve({
          fileStream,
          filename: `${uuid}.mp4`
        });
      })
      .on("progress", function(progress) {
        console.log(`${resolution}: ${progress.percent}%`);
      })
      .on("error", function(err) {
        console.log(err);
        reject(null);
      })
      .run();
  });
};
