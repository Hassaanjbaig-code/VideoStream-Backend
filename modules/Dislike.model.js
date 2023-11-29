const mongoose = require("mongoose")

const disLike = mongoose.Schema({
    const: {
        type: Number,
        default: 0,
        required: true
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
)

const modelDisLike = mongoose.model("Dislike", disLike)

module.exports = modelDisLike

