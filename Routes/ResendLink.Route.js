const express = require("express");
const resendRoute = express.Router()
const resendLink = require("../controller/ResendEmail.controller")

resendRoute.get("/:email", resendLink)


module.exports = resendRoute
