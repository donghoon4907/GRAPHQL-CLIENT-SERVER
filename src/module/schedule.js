const schedule = require("node-schedule");
const fs = require("fs");
const path = require("path");
const { prisma } = require("../../generated/prisma-client");
const { generateTranscodeVideo } = require("./file");
const { upload } = require("./s3client");

exports.executeTranscode = () => {
  schedule.scheduleJob("30 * * * * *", async () => {
    const videos = await prisma
      .posts({
        where: {
          video: {
            status: "queue"
          }
        }
      })
      .video();
    console.log("TRANSCODING START: GET TARGET");
    videos.forEach(async ({ video }) => {
      Object.keys(video).forEach(async (key) => {
        if (!video[key]) {
          const [_, resolution] = key.split("_");
          const transcoded = await generateTranscodeVideo({
            url: video.url,
            resolution
          });
          if (transcoded) {
            const location = await upload({
              filename: transcoded.filename,
              fileStream: transcoded.fileStream
            });

            if (location) {
              await prisma.updateVideo({
                data: {
                  [key]: location,
                  status: key === "url_1080p" ? "complete" : "working"
                },
                where: {
                  id: video.id
                }
              });
              // 파일 삭제
              fs.unlinkSync(
                path.join(__dirname, `../temps/${transcoded.filename}`)
              );
            }
          }
        }
      });
    });
    console.log("TRANSCODING END");
  });
};
