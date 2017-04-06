import fs from 'fs';
import AWS from 'aws-sdk';

const bucketName = process.env.GYLD_BUCKET || "gyld-staging";
const awsAccessKey = process.env.AWS_ACCESS_KEY || "AKIAI3K3WGZNDWZKJ7TQ";
const awsSecretKey = process.env.AWS_ACCESS_KEY || "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";
const awsRegion = 'eu-central-1';

AWS.config.update({accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey});
AWS.config.update({region: awsRegion});

let gyldBucket = new AWS.S3({params: {Bucket: bucketName}});

exports.uploadToS3 = function (file, subDirectory, callback) {
  console.log("file upload to s3", file.path, subDirectory + file.name);
  gyldBucket
    .upload({
      ACL: 'public-read',
      Body: fs.createReadStream(file.path),
      Key: subDirectory + "/" + file.name,
      ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    })
    .send(callback);
}

exports.deleteFromS3 = function (key, subDirectory) {
  var params = {
    Key: subDirectory + key
  };
  gyldBucket.deleteObject(
    params,
    function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}

exports.getPresignedUrl = function (key, subDirectory) {
  var s3 = new AWS.S3({computeChecksums: true}); // this is the default setting
  var params = {Bucket: bucketName, Key: subDirectory + key, Expires: 60};
  var url = 'https://gyld-staging.s3-website.eu-central-1.amazonaws.com/' + subDirectory + key;
  var signedUrl = s3.getSignedUrl('putObject', params);
  return {url: url, signedUrl: signedUrl};
}
