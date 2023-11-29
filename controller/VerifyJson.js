const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config()

function VerifyJson(req, res, next) {
    const authdata = req.headers["authorization"]
    const token = authdata && authdata.split(' ')[1]
    if (token == null) return res.status(404).json("Login Again")
    jwt.verify(token, process.env.TOKEN_SECRET, (err ,user) => {
        if(err) return res.status(404).json(err)
        req.user = user 

        next()
    })
}

module.exports = VerifyJson
