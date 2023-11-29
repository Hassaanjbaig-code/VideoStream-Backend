const express = require("express");
const subscribeRoutes = express.Router();
const VerifyJson = require("../controller/VerifyJson");
const subscribeChannel  = require("../controller/Subscribe.controller");

subscribeRoutes.get("/:id", VerifyJson, subscribeChannel);

module.exports = subscribeRoutes;
