const express = require("express");
const ConfirmEmail = require("../controller/ConfirmEmail.controller");
const ConfirmRoute = express.Router();

// Make sure you're using the exported function as the route handler
ConfirmRoute.get('/:email/:token', ConfirmEmail);

module.exports = ConfirmRoute;
