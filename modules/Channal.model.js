const mongoose = require("mongoose");

const channel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      ref: "Users",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const channelModel = mongoose.model("Channels", channel);
module.exports = channelModel;
