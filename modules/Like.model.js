const mongoose = require("mongoose");

const like = mongoose.Schema({
  count: {
    type: Number,
    default: 0,
    required: true,
  },
  video: {
    ref: "VideosService",
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  channel: {
    ref: "Channels",
    type: mongoose.Schema.ObjectId,
    required: true,
  },
},{
    timestamps: true
}
);

const LikeModel = mongoose.model("Like", like)
module.exports = LikeModel
