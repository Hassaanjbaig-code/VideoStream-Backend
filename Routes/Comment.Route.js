const express = require("express")
const commentRoute = express.Router()
const { postComment, deleteComment, showComment } =require("../controller/Comments.controller")
const VerifyJson = require("../controller/VerifyJson")

commentRoute.post("/:id", VerifyJson, postComment);
commentRoute.delete("/:id", VerifyJson, deleteComment);
commentRoute.get("/:id", showComment)

module.exports = commentRoute
