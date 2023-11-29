const express = require("express")
const commentLIkeRoute = express.Router();
const commentLikeGet = require("../controller/commentLike.controller")
const VerifyJson = require("../controller/VerifyJson")

commentLIkeRoute.get("/:id", VerifyJson, commentLikeGet)
