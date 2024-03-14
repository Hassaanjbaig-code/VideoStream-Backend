const mongoose = require("mongoose")

const TokenVerificationSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 86400000 }
    }
})


const TokenVerification = mongoose.model("Token", TokenVerificationSchema)

module.exports = TokenVerification
