const express = require("express");
const channelRoutes = express.Router();
const { FetchChannel, PostChannel } = require("../controller/channel");
const VerifyJson = require("../controller/VerifyJson")
const upload = require("../controller/upload")

channelRoutes.get("/", FetchChannel);
channelRoutes.post("/",upload.single('file'), VerifyJson ,PostChannel)

module.exports = channelRoutes;
