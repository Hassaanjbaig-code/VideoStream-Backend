const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const userModel = mongoose.model("Users", UserSchema)

module.exports = userModel

