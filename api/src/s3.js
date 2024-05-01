const AWS = require("aws-sdk");

const endpoint = "cellar-c2.services.clever-cloud.com";
const accessKeyId = "IHGMSM62YCC31J8SO90V";
const secretAccessKey = "TULAKDpir82XBjeizffxk57n34MqKJE6BBhfnO31";
const CELLAR_BUCKET_NAME = "selegoprojectx";

let s3 = new AWS.S3({ endpoint, accessKeyId, secretAccessKey });

function uploadToS3FromBuffer(path, buffer, ContentType) {
  return new Promise((resolve, reject) => {
    var params = {
      ACL: "public-read",
      Bucket: CELLAR_BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType,
      Metadata: { "Cache-Control": "max-age=31536000" },
    };
    s3.upload(params, function (err, data) {
      if (err) return reject(`error in callback:${err}`);
      resolve(data.Location);
    });
  });
}

function listS3(url) {
  return new Promise((resolve, reject) => {
    s3.listBuckets(function (err, data) {
      if (err) return reject(`error in callback:${err}`);
      const buckets = data.Buckets;
      for (let bucket of buckets) {
        s3.listObjectsV2({ Bucket: bucket.Name, Prefix: url }, function (err, data) {
          if (err) return reject(`error in callback:${err}`);
          resolve(data);
        });
      }
    });
  });
}

function getS3File(name) {
  const p = new Promise((resolve, reject) => {
    const params = { Bucket: CELLAR_BUCKET_NAME, Key: name };
    s3.getObject(params, (err, data) => {
      if (err) return resolve(null);
      const objectData = data.Body.toString("utf-8");
      resolve(objectData);
    });
  });
  return p;
}

module.exports = {
  uploadToS3FromBuffer,
  listS3,
  getS3File,
};
