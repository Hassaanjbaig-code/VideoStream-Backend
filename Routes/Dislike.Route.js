const express = require("express")
const DislikeRoute = express.Router()
const VerifyJson = require("../controller/VerifyJson")
const { postDisLike } = require("../controller/Dislike.controller")

DislikeRoute.get("/:id", VerifyJson, postDisLike)

module.exports = DislikeRoute

