const mongo = require("mongoose");
const express = require("express");
const app = express();
const videoSevice = require("./modules/VideoSchema.model");
const port = 3000;
const routes = require("./Routes/userRoutes");
const body_Parser = require("body-parser");
const VerifyJson = require("./controller/VerifyJson");
const cors = require("cors");
const channelRoutes = require("./Routes/channel.Route");
const channelModel = require("./modules/Channal.model");
const subscribeRoutes = require("./Routes/Subscribe.routes");
const SubscribeModule = require("./modules/Subcribe.model");
const likeRoute = require("./Routes/Like.Route");
const LikeModel = require("./modules/Like.model");
const DislikeRoute = require("./Routes/Dislike.Route");
const modelDisLike = require("./modules/Dislike.model");
const commentRoute = require("./Routes/Comment.Route");
const commentModel = require("./modules/Comment.model");
const comDikLike = require("./Routes/commentDisLIke.Route");
const comLike = require("./Routes/commentLike.Route");
const {
  uploadFile,
  urlPublicURL,
  deleteFile,
} = require("./controller/FileUpload.controller");
const upload = require("./controller/upload");
app.use(body_Parser.json());

app.use(cors());

app.use("/user", routes);

app.use("/channel", channelRoutes);
app.use("/subscribe", subscribeRoutes);
app.use("/like", likeRoute);

app.use("/Dislike", DislikeRoute);
app.use("/comment", commentRoute);
app.use("/commentLike", comLike);
app.use("/commentDislike", comDikLike);

mongo
  .connect("mongodb://localhost:27017/video_Service")
  .then(() => {
    app.listen(port, () => {
      console.log("Server is started http://localhost:3000");
    });
    console.log("MongoDB is started");
  })
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  const videos = await videoSevice.find();

  if (videos.length === 0) {
    return res.status(200).json("Add a Video");
  }

  const videoDataWithChannels = await Promise.all(
    videos.map(async (video) => {
      // Populate the 'channel' field to get channel details
      await video.populate("channel");
      return {
        video: video,
        channel: video.channel[0],
      };
    })
  );

  res.status(200).json({
    status: 200,
    data: videoDataWithChannels,
  });
});

app.post(
  "/",
  VerifyJson,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    let { title, description } = req.body;
    // console.log(req.files);
    const userId = req.user.user[0]._id;
    let image;
    let video;

    if (!req.files["video"] && !req.files["image"]) {
      return res.status(404).json({
        status: 404,
        message: "PLease conform that you added a image and video",
      });
    }
    console.log(req.files["video"]);
    if (req.files) {
      image = req.files["image"][0];
      video = req.files["video"][0];
    }
    if (!title || !description || !image || !video)
      return res.status(404).json("Please Fill the Field");
    const channel = await channelModel.find({ user: userId });
    if (channel.length == 0) {
      return res.status(404).json({
        status: 404,
        message: "Please enter a channel",
      });
    }
    let channelId = channel[0]._id;
    let uploadImage = await uploadFile(image);
    let uploadVideo = await uploadFile(video);
    let URLimage = await urlPublicURL(uploadImage.data.id);
    let URLVideo = await urlPublicURL(uploadVideo.data.id);
    // console.log(uploadVideo.data.id)
    videoSevice.find({ title, description }).then(async (data) => {
      // console.log(data);
      if (data.length) return res.status(404).json("Already Exiten");
      try {
        const Created = await videoSevice.create({
          title,
          description,
          image: URLimage.webContentLink,
          video: URLVideo.webContentLink,
          imageID: uploadImage.data.id,
          videoID: uploadVideo.data.id,
          channel: channelId,
        });
        res.status(200).json({
          status: 200,
          body: Created,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
      }
    });
  }
);

app.delete("/:id", VerifyJson, async (req, res) => {
  const { id } = req.params;
  let videoID = await videoSevice.findById(id);
  await deleteFile(videoID.videoID);
  await deleteFile(videoID.imageID);
  // if (deleteImageDrive.status == 200 ) {

  // }
  // console.log("This is the video Delete", deleteVideoDrive)
  // console.log("This is the Image Delete", deleteImageDrive)
  videoSevice
    .findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json("Video is not Found");
      }
      res.json("Deleted");
    })
    .catch((err) => res.json(err));
});

app.get("/:id", async (req, res) => {
  let { id } = req.params;
  videoSevice
    .findById(id)
    .then(async (result) => {
      if (!result) {
        return res.status(404).json("Video not found");
      }
      // console.log(result)

      const resultChannel = await channelModel.findById(result.channel);
      const Calculatesubscribe = await SubscribeModule.find({
        subScribeChannel: result.channel,
      });

      // console.log(resultChannel)
      // cons
      const countLike = await LikeModel.find({
        video: id,
      });

      const countDislike = await modelDisLike.find({
        video: id,
      });

      const comment = await commentModel.find({
        video: id,
      });
      // console.log(comment)
      let videos= await GetVideo(id);
      // let videos = await Promise.all(
      //   video.map(async (data) => {
      //     // await data.populate("channel");
      //     let channel = await channelModel.findById(data.channel)
      //     // console.log("This is the channel", channel)
      //     return {
      //       video: video[0],
      //       channelName: channel.name,
      //       channelImage: channel.image,
      //     };
      //   })
      // );
      const enrichedVideos = await Promise.all(
        videos.map(async (video) => {
          const channel = await channelModel.findById(video.channel);
      
          return {
            video,
            channelName: channel.name,
            channelImage: channel.image,
          };
        })
      );
      // Update the view count
      await videoSevice.findByIdAndUpdate(id, {
        $inc: { View: 1 }, // Increment the views by 1
      });

      res.status(200).json({
        channel: resultChannel,
        data: result,
        calculate: Calculatesubscribe.length,
        like: countLike.length,
        Dislike: countDislike.length,
        comment: comment,
        TotalComment: comment.length,
        Like: countLike,
        DisLike: countDislike,
        subscribe: Calculatesubscribe,
        sideVideo: enrichedVideos,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

async function GetVideo(id) {
  // $ne for remove one id in the array in the database
  const query = { _id: { $ne: id } };
  const documents = await videoSevice.find(query);
  // console.log(documents)
  return documents;
}

// app.post("/channel", (req, res) => {
//   let { name, image, description, videoService } = req.body;
//   let user = req.user.id;
//   // console.log(req.body)
//   if (!name || !image || !description || !videoService)
//     return res.status(404).json("Please Fill the Field");
//   user = req.user._id;
//   userModel.find({ user }).then((data) => {
//     if (!data) return res.status(404).json("User is not found");
//     channelModel.find({ name, description, image }).then((data) => {
//       if (data.length >= 0)
//         return res.status(404).json("Channel is already exit");
//       try {
//         const Created = channelModel.create({
//           name,
//           image,
//           description,
//           videoService,
//           user,
//         });
//         res.status(200).json(Created);
//       } catch (error) {
//         console.log(error);
//         res.status(500).json(error.message);
//       }
//     });
//   });
// });

// app.get("/channel", (req, res) => {
//   try {
//     channelModel.find().then((result) => {
//       if (result.length == 0) {
//         return res
//           .status(404)
//           .json({ message: "There is no channel", status: 404 });
//       }
//       res.status(200).json({
//         data: result,
//         status: 200,
//       });
//     });
//   } catch (error) {
//     res.status(404).json(error)
//   }
// });
