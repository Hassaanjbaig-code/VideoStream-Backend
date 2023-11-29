const mongoose = require("mongoose");

const subscribeScheme = mongoose.Schema(
  {
    count: {
      type: Boolean,
      default: false,
      required: true,
    },
    mainChannel: {
      ref: "Channels",
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    subScribeChannel: {
      ref: "Channels",
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubscribeModule = mongoose.model("Subscribe", subscribeScheme);

module.exports = SubscribeModule;
