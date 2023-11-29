const express = require("express")
const comDikLike = express.Router()
const verifyJSON = require("../controller/VerifyJson")
const commentDislike =require("../controller/CommentDisklike.controller")


comDikLike.get("/:id", verifyJSON, commentDislike)

module.exports = comDikLike