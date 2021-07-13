const AWS = require('aws-sdk');

var multer = require("multer");
var multerS3 = require("multer-s3");

const path = require("path")

const dotenv = require('dotenv') 
dotenv.config()

const AWS_config_region= process.env.AWS_config_region;
const AWS_IDENTITYPOOLID = process.env.AWS_IDENTITYPOOLID;
const bucket = "appcenterfinal"

AWS.config.update({
  region : AWS_config_region,
  credentials : new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITYPOOLID
})
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {Bucket: bucket}
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: "public-read",
    key: (req, file, cb) => {
      let ext = path.extname(file.originalname)
      cb(null, 'images/'+path.basename(file.originalname, ext)+ Date.now().toString()+ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 용량 제한
});



module.exports = upload;

// exports.deleteObjects = s3.deleteObjects(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data); 
// });




