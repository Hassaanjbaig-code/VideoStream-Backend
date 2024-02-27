const channelModel = require("../modules/Channal.model");
const userModel = require("../modules/User.model");
const { uploadFile, urlPublicURL } = require("./FileUpload.controller")
const { uploadFileC } = require("./FileUploadCloudinary.controller")

function FetchChannel(req, res) {
  channelModel
    .find()
    .then((result) => {
      if (result.length == 0) {
        res.json({
          status: 404,
          message: "There is no channel",
        });
      } else {
        res.json({
          status: 200,
          data: result,
        });
      }
    })
    .catch((error) => res.status(500).json(error));
}

async function PostChannel(req, res) {
  // console.log("This is for user testing", req.user.user[0]) User is coming 
  try {
    const { name, description } = req.body;
    let image  = req.file; 

    // console.log(image);

    if (!name || !image || !description) {
      return res.status(400).json({
        status: 400,
        message: "Please fill in all fields",
      });
    }

    const userId = req.user.user[0]._id;

    // Check if a channel already exists for the user
    const existingChannel = await channelModel.findOne({ user: userId });

    if (existingChannel) {
      // A channel already exists for the user
      return res.status(400).json({
        status: 400,
        message: "Channel is already created for this user",
      });
    }

    // No channel exists for the user, proceed with creating a new one
    const result = await channelModel.findOne({ name });

    if (result) {
      return res.status(400).json({
        status: 400,
        message: "Name is already in use",
      });
    }

    // Upload the file
    // console.log(image)
    const file = await uploadFileC(image);
    // console.log("This is the file we are getting", file.url)

    // console.log("This the return which we are getting ",file);
    if (file.message == 400) {
      res.status(400).json(file.error)
    } else {
      // let URLimage = await urlPublicURL(file.data.id)
      // res.status(200).json(URLimage)
    // Now you can use 'file' and other data to create a new channel
    const newChannel = new channelModel({
      name,
      image: file.url, // Assuming 'url' is the property containing the file URL after upload
      imageID: file.public_id,
      description,
      user: userId,
    });

    newChannel.save().then(() => {
      return res.status(201).json({
        status: 201,
        message: "Channel created successfully",
      });
    });
  }
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}
module.exports = { FetchChannel, PostChannel };
