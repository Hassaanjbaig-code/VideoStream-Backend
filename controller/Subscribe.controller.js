const channelModel = require("../modules/Channal.model");
const SubscribeModule = require("../modules/Subcribe.model");
const videoSevice = require("../modules/VideoSchema.model")

async function SubscribeChannel(req, res) {
  const userId = req.user.user[0]._id; // Subscribe user
  const id = req.params.id
  const VideoData = await videoSevice.findById(id)
  const mainChannel = VideoData.channel.toString() // Find the main Channel ID
  try {
    const channels = await channelModel.find({ user: userId });
    if (!channels || channels.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Create a channel",
      });
    }
    
    const channelId = channels[0]._id.toString();
    
    // Check if a subscription already exists for the given channels
    console.log("MianChannel is found", mainChannel);
    const foundSubscription = await SubscribeModule.findOne({
      mainChannel,
      subScribeChannel: channelId
    });
    
    if (foundSubscription) {
      console.log("Subscribe is found", foundSubscription);
      let FoundedSubscriptionID = foundSubscription._id
      // If a subscription exists, remove it
      await SubscribeModule.findByIdAndRemove(FoundedSubscriptionID)
      return res.status(200).json({
        status: 200,
        message: "Subscription removed",
      });
    } else {
      const newSubscription = new SubscribeModule({
        count: 1, // Set the initial count to 1
        mainChannel,
        subScribeChannel: channelId,
      });
      await newSubscription.save();
      return res.status(201).json({
        status: 201,
        message: "Subscription saved",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

module.exports = SubscribeChannel;
