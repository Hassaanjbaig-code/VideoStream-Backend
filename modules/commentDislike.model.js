const mongoose = require("mongoose");

const commentDislikeSchema = mongoose.Schema(
  {
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    comment: {
      ref: "Comments",
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

const commentDislike = mongoose.model("CommentDislike", commentDislikeSchema)

module.exports = commentDislike
