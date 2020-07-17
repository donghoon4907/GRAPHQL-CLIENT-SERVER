const AWS = require("aws-sdk");

const config = {
  bucketName: "frisk/transcoded",
  bucketRegion: "ap-northeast-2",
  identifyPoolId: "ap-northeast-2:ebf9cb6b-be96-46e2-a26f-e7fe7608bc80"
};

AWS.config.update({
  region: config.bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.identifyPoolId
  })
});

// Create S3 service object
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: `${config.bucketName}/video` }
});

exports.upload = async ({ filename, fileStream }) => {
  const uploadParams = {
    Key: filename,
    Body: fileStream,
    ACL: "public-read"
  };
  // call S3 to retrieve upload file to specified bucket
  try {
    const { Location } = await s3.upload(uploadParams).promise();
    return Location;
  } catch {
    console.error("upload error in s3 bucket");
    return false;
  }
};

exports.delete = async ({ filename }) => {
  const param = {
    Key: filename
  };
  try {
    await s3.deleteObject(param).promise();
    return true;
  } catch {
    console.error("delete error in s3 bucket");
    return false;
  }
};
