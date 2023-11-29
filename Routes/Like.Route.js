const express = require("express");
const likeRoute = express.Router();
const VerifyJson = require("../controller/VerifyJson");
const { postLike } = require("../controller/Like.controller");

likeRoute.get("/:id", VerifyJson, postLike);
module.exports = likeRoute;

