const channelModel = require("../modules/Channal.model");
const like = require("../modules/Like.model");

function postLike(req, res) {
  const userId = req.user.user[0]._id;
  const videoId = req.params.id;

  // console.log("UserID",req)

  channelModel.find({user: userId}).then((result) => {
    // console.log("Channel Detail",result)
    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Create a channel",
      });
    }

    let channalId = result[0]._id 
    // console.log()
    // Check if a like already exists for the given video and user
    like.findOne({ video: videoId, channel: channalId }).then((foundLike) => {
      if (foundLike) {
        // If a like exists, remove it
        like
          .findByIdAndRemove(foundLike._id)
          .then(() => {
            res.status(200).json({
              status: 200,
              message: 250,
            });
          })
          .catch((error) => {
            res.status(500).json({
              status: 500,
              message: error,
            });
          });
      } else {
        // If no like exists, create a new like document
        const likeVideo = new like({
          count: 1, // Set the initial count to 1
          video: videoId,
          channel: channalId,
        });

        // console.log("This is Like video new",likeVideo)

        likeVideo
          .save()
          .then(() => {
            res.status(201).json({
              status: 201,
              message: 200,
            });
          })
          .catch((error) => {
            res.status(500).json({
              status: 500,
              message: error,
            });
          });
      }
    });
  });
}


module.exports = { postLike }