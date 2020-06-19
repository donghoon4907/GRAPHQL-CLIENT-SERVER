const fs = require("fs").promises;
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment");
const delay = require("delay");
// 파일 존재 유무
exports.isExistFile = async ({ filepath }) => {
  try {
    await fs.promises.access(filepath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    }
  }
};
// 영상 정보
exports.getVideoInfo = ({ name }) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path.join(__dirname, `../public/videos/${name}`), function(
      err,
      data
    ) {
      if (err) reject(err);
      else {
        const { width, height, duration, r_frame_rate } = data.streams[0];
        const splitFrameRate = r_frame_rate.split("/");
        const framerate = Math.floor(
          Number(splitFrameRate[0]) / Number(splitFrameRate[1])
        );
        resolve({ width, height, duration, framerate });
      }
    });
  });
};
// 파일 업로드
exports.uploadFile = async ({ type, file, name }) => {
  try {
    const isError = await file.mv(
      path.join(__dirname, `../public/${type}/${name}`)
    );
    if (isError) {
      return res
        .status(500)
        .send({ message: "파일 업로드중 오류가 발생했습니다." });
    } else {
      return {
        success: true
      };
    }
  } catch (e) {
    console.log(e);
  }
};
// 파일명 생성
exports.makeFileName = ext => `${moment().format("YYYYMMDDHHmmss")}.${ext}`;
// 파일 확장자
exports.getFileExt = name => name.substring(name.indexOf(".") + 1);
// 영상변환
exports.makeEditVideo = ({ filename, framerate, startframe, endframe }) => {
  const ext = this.getFileExt(filename);
  const outputFilename = this.makeFileName(ext);
  const startTime = Math.floor(Number(startframe) / Number(framerate));
  const endTime = Math.floor(Number(endframe) / Number(framerate));
  const duration = endTime - startTime;

  return new Promise((resolve, reject) => {
    ffmpeg(path.join(__dirname, `../public/videos/${filename}`))
      .output(path.join(__dirname, `../public/videos/${outputFilename}`))
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec("copy")
      .on("end", function(err) {
        if (!err) {
          resolve({
            filename: outputFilename,
            duration
          });
        }
      })
      .on("error", function(error) {
        reject({ error });
      })
      .run();
  });
};
// 영상에서 썸네일 생성
exports.makeThumbnail = async ({ filename }) => {
  try {
    const outputFilename = this.makeFileName("png");
    await ffmpeg(
      path.join(__dirname, `../public/videos/${filename}`)
    ).screenshots({
      count: 1,
      timemarks: ["00:00:02.000"],
      filename: outputFilename,
      folder: path.join(__dirname, `../public/images`),
      size: "1920x1280"
    });
    await delay(2000);
    return { output: outputFilename };
  } catch (e) {
    return e;
  }
};
