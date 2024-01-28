const channelModel = require("../modules/Channal.model");
const  modelDisLike = require("../modules/Dislike.model")

function postDisLike(req, res) {
  const userId = req.user.user[0]._id;
  const videoId = req.params.id;

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
    modelDisLike.findOne({ video: videoId, channel: channalId }).then((foundDislike) => {
      if (foundDislike) {
        // If a like exists, remove it
        modelDisLike
          .findByIdAndRemove(foundDislike._id)
          .then(() => {
            res.status(200).json({
              status: 200,
              message: "Dislike has been removed",
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
        const DislikeVideo = new modelDisLike({
          count: 1, // Set the initial count to 1
          video: videoId,
          channel: channalId,
        });

        // console.log("This is Like video new",likeVideo)

        DislikeVideo
          .save()
          .then(() => {
            res.status(201).json({
              status: 201,
              message: `Dislike has been added to this video`,
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


module.exports = { postDisLike }