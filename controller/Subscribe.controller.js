const channelModel = require("../modules/Channal.model");
const SubscribeModule = require("../modules/Subcribe.model");

function SubscribeChannel(req, res) {
  const userId = req.user.user[0]._id; // Subscribe user
  const subscribeId = req.params.id; // which you wanted to subscibe`
  if (!userId) {
    res.status(404).json({
      status: 404,
      message: "Please sign in",
    });
  } else {
    channelModel.find({ user: userId }).then((result) => {
      // console.log("Channel Detail",result)
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Create a channel",
        });
      }
      channelModel.findById(subscribeId).then((subChannel) => {
        if (subChannel.length == 0) {
          return res.status(404).json({
            status: 404,
            message: "Please enter a channel",
          });
        }
        
        let channalId = result[0]._id;
        // console.log()
        // Check if a like already exists for the given video and user
        SubscribeModule.findOne({
          mainChannel: channalId,
          subScribeChannel: subscribeId,
        }).then((foundLike) => {
          if (foundLike) {
            // If a like exists, remove it
            SubscribeModule.findByIdAndRemove(foundLike._id)
            .then(() => {
              res.status(200).json({
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
          } else {
            // If no like exists, create a new like document
            const subscribeChannel = new SubscribeModule({
              count: 1, // Set the initial count to 1
              mainChannel: channalId,
              subScribeChannel: subscribeId,
            });
            
            // console.log("This is Like video new",likeVideo)

            subscribeChannel
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
        })
      });
    });
  }
}

module.exports = SubscribeChannel;
