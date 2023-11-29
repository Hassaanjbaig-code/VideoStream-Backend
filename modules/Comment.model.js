const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    Comment: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
