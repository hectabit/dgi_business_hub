const AWS = require("aws-sdk");
const chalk = require("chalk");

//------------------------------------------------------------------------

/**
 * global variables
 */

const bucketName = "dgilearning-photos";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECREAT_KEY;

if (!accessKeyId || !secretAccessKey) {
    console.log(chalk.red.inverse("AWS keys not found in environment"));
}

const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});

//------------------------------------------------------------------------

const uploadFile = (name, data, type) => {
    return new Promise((resolve, reject) => {
        try {
            const params = {
                Bucket: bucketName,
                Key: name, // File name you want to save as in S3
                Body: data,
                ACL: "public-read",
                ContentEncoding: "base64",
                ContentType: `image/${type}`,
            };

            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                var path = data.Location;
                // if (path) {
                //     path = path.split(`.com/`).pop();
                // }

                resolve(path);
            });
        } catch (error) {
        console.log("error",error);

            return reject(error);
        }
    });
};

const deleteFile = (name) => {
    return new Promise((resolve, reject) => {
        try {
            s3.deleteObject(
                {
                    Bucket: bucketName,
                    Key: name,
                },
                (err, data) => {
                    if (err) {
                        //console.log("err", err);
                        return reject(err);
                    }
                    return resolve();
                }
            );
        } catch (error) {
        console.log("error",error);

            return reject(error);
        }
    });
};

//------------------------------------------------------------------------

module.exports = { uploadFile, deleteFile };
