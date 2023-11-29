const commentModel = require("../modules/Comment.model");
const channelModel = require("../modules/Channal.model");
const commentLike = require("../modules/commentLike.model");

function postComment(req, res) {
  const userId = req.user.user[0]._id;
  const videoId = req.params.id;
  console.log("Working of post comment");
  let { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ status: 400, messgae: "Add a comment" });
  }
  channelModel.find({ user: userId }).then((result) => {
    // console.log("Channel Detail",result)
    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Create a channel",
      });
    }
    let channalId = result[0]._id;

    commentModel
      .findOne({ video: videoId, channel: channalId })
      .then((foundComment) => {
        // console.log(foundComment);
        if (foundComment) {
          // If a like exists, remove it
          commentModel
            .findById(foundComment._id)
            .then(() => {
              res.status(200).json({
                status: 200,
                message: "You have already write your comment",
              });
            })
            .catch((error) =>
              res.status(401).json({
                status: 401,
                message: error,
              })
            );
        } else {
          const createChannel = new commentModel({
            Comment: comment,
            video: videoId,
            channel: channalId,
          });
          createChannel.save().then(() => {
            console.log("Comment is created");
            res.status(201).json({
              status: 201,
              message: "Comment is Added",
            });
          });
        }
      });
  });
}

function deleteComment(req, res) {
  const userId = req.user.user[0]._id;
  let { id } = req.params;
  // console.log("Delete Comment", id)
  channelModel
    .find({ user: userId })
    .then((result) => {
      let channelId = result[0]._id;
      // console.log("Find a channel ID", channelId)
      commentModel.find({channel: channelId, _id: id}).then((resultForComment) => {
        console.log("Comment in this id" ,resultForComment)
      })
      commentModel
        .findOneAndDelete({ channel: channelId, _id: id })
        .then((result) => {
          console.log(result)
          if (!result) {
            res.status(404).json({
              status: 404,
              message: "Comment not found or already deleted",
            });
          } else {
            res.status(200).json({
              status: 200,
              message: "Comment deleted successfully",
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            message: "Error deleting comment",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Error finding user's channel",
        error: error.message,
      });
    });
}

function showComment(req, res) {
  let { id } = req.params;
  // console.log("Show Comment");

  commentModel
    .find({ video: id })
    .then((comments) => {
      if (comments.length > 0) {
        const promises = comments.map((comment) =>
          channelModel.findById(comment.channel)
        );

        Promise.all(promises)
          .then((channelResults) => {
            let commentsWithChannels = comments.map((comment, index) => ({
              ...comment._doc,
              channel: channelResults[index],
            }));

            // Fetch comment likes for each comment
            const commentLikePromises = commentsWithChannels.map((comment) =>
              commentLike.find({ comment: comment._id })
            );

            // console.log(commentLikePromises);

            // Log the commentsWithChannels array after the comment likes have been fetched
            Promise.all(commentLikePromises)
              .then((commentLikeResults) => {
                // Map comment likes to comments
                commentsWithChannels = commentsWithChannels.map(
                  (comment, index) => {
                    const commentLikes = commentLikeResults[index];
                    if (commentLike.length > 1) {
                      comment.commentLikes = commentLikes; // Add commentLikes to comment
                    }
                    // console.log(comment)
                    return comment;
                  }
                  );
                  // console.logcommentsWithChannels

                // console.log("After the Like", commentsWithChannels);

                res.status(200).json({
                  status: 200,
                  video: {
                    comments: commentsWithChannels,
                  },
                });
              })
              // .catch((error) => {
              //   res.status(500).json(error);
              // });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        res.status(200).json({
          status: 200,
          video: {
            comments: [],
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

module.exports = { postComment, deleteComment, showComment };
