const mongo = require('mongoose')

const VideoService = mongo.Schema({
    title: {
        type: String,
        required: [true, "Please Enter the Title of Video"]
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    imageID: {
        type: String,
        required: true
    },
    videoID: {
        type: String,
        required: true
    },
    View: {
        type: Number,
        default: 0
    },
    channel: {
        ref: "Channels",
        type: mongo.Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
})


const videoModel = mongo.model("VideosService", VideoService)

module.exports = videoModel

