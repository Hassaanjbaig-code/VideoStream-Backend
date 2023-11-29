const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

function GenerateJson(data) {
    return jwt.sign({user: data}, process.env.TOKEN_SECRET)
}

module.exports = GenerateJson
