const AWS = require('aws-sdk');

var multer = require("multer");
var multerS3 = require("multer-s3");

const path = require("path");
const dotenv = require('dotenv');
dotenv.config();

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

function destroyImage(params) { 
    s3.deleteObjects(params, function(err, data) {
        if (err){
             console.log(err, err.stack);
        }else{
            console.log(data);
        }      
    }
)};

module.exports = destroyImage;