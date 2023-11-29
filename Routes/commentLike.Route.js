const express = require("express")
const comLike = express.Router()
const verifyJSON = require("../controller/VerifyJson")
const commentLikeGet = require("../controller/commentLike.controller")


comLike.get("/:id", verifyJSON, commentLikeGet)

module.exports = comLike