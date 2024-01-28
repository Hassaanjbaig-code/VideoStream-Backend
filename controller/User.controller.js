const channelModel = require("../modules/Channal.model");
const SubscribeModule = require("../modules/Subcribe.model");
const videoModel = require("../modules/VideoSchema.model");

function UserIntro(req, res) {
  let user = req.user.user[0]._id;
  // console.log(req)
  //   console.log("Working", user);
  // res.status(200).json("Working")
  channelModel.find({ user: user }).then((result) => {
    // console.log(result);
    if (result.length == 0) {
      res.status(404).json({
        status: 404,
        message: "Please create a Channel",
      });
    } else {
      videoModel.find({ channel: result[0]._id }).then((chanVideo) => {
        SubscribeModule.find({ channel: result[0]._id }).then((totalSubscribe) => {
          console.log(chanVideo);
          if (chanVideo == 0) {
            res.status(202).json({
              status: 202,
              data: {
                channel: result[0],
                video: chanVideo,
              },
            });
          } else {
            res.status(202).json({
              status: 202,
              data: {
                channel: result[0],
                video: chanVideo,
                subscribe: totalSubscribe.length,
              },
            });
          }
        });
      });
    }
  });
}

module.exports = UserIntro;
