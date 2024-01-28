const commentLike = require("../modules/commentLike.model");
const channelModel = require("../modules/Channal.model")

function commentLikeGet(req, res) {
  const userId = req.user.user[0]._id;
  const commentID = req.params.id;

  channelModel.find({ user: userId }).then((result) => {
    // console.log("Channel Detail",result)
    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Create a channel",
      });
    }

    let channalId = result[0]._id;
    // console.log()
    // Check if a like already exists for the given video and user
    commentLike.findOne({ comment: commentID, channel: channalId }).then((foundLike) => {
      if (foundLike) {
        // If a like exists, remove it
        commentLike
          .findByIdAndRemove(foundLike._id)
          .then(() => {
            res.status(200).json({
              status: 200,
              message: "Like has been removed",
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
        const likeComment = new commentLike({
          count: 1, // Set the initial count to 1
          comment: commentID,
          channel: channalId,
        });

        // console.log("This is Like video new",likeVideo)

        likeComment
          .save()
          .then(() => {
            res.status(201).json({
              status: 201,
              message: `Like has been added to this video`,
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

module.exports = commentLikeGet;
