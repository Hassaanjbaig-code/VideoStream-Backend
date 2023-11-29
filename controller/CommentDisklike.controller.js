const commentLike = require("../modules/commentLike.model");
const channelModel = require("../modules/Channal.model");
const commentDislike = require("../modules/commentDislike.model");

function commentDislikeget(req, res) {
  const userId = req.user.user[0]._id;
  const commentID = req.params.id;

  console.log("UserID", userId);

  channelModel.find({ user: userId }).then((result) => {
    // console.log("Channel Detail",result)
    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Create a channel",
      });
    }

    let channalId = result[0]._id;
    commentLike
      .find({ comment: commentID, channel: channalId })
      .then((Likeresult) => {
        if (Likeresult) {
          res.status(404).json({
            status: 404,
            message: "You already like the commment",
          });
        } else {
          // console.log()
          // Check if a like already exists for the given video and user
          commentDislike
            .findOne({ comment: commentID, channel: channalId })
            .then((foundLike) => {
              console.log(foundLike);
              if (foundLike) {
                // If a like exists, remove it
                commentDislike
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
                const DislikeComment = new commentDislike({
                  count: 1, // Set the initial count to 1
                  comment: commentID,
                  channel: channalId,
                });

                // console.log("This is Like video new",likeVideo)

                DislikeComment.save()
                  .then(() => {
                    console.log("Like is Save");
                    res.status(201).json({
                      status: 201,
                      message: `Like has been added to this video`,
                    });
                  })
                  .catch((error) => {
                    console.log(error.message);
                    res.status(500).json({
                      status: 500,
                      message: error,
                    });
                  });
              }
            });
        }
      });
  });
}

module.exports = commentDislikeget;
