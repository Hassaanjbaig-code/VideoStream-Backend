const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
// const fs = require("fs");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const fs = require("fs").promises; // Make sure to include the 'fs' module

const streamifier = require("streamifier"); // Make sure to include the 'streamifier' module

async function uploadFileC(file) {
  const mainFolderName = "main";
  const filePathOnCloudinary = mainFolderName + "/" + file.originalname;

  const bufferStream = streamifier.createReadStream(file.buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: filePathOnCloudinary, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject({ message: 400, error });
        } else {
          resolve({
            message: 200,
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      }
    );

    bufferStream.pipe(uploadStream);
  });
}

async function DeleteImageC(name) {
    await cloudinary.uploader.destroy(name, (error, result) => {
      return result
    })
}

module.exports = { uploadFileC, DeleteImageC };
