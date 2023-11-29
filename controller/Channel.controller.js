const channel = require("./../modules/Channal.model")
const userModel = require("./../modules/User.model")

function createChannel(req, res) { // Renamed to follow JavaScript naming conventions (camelCase)
    let { name, image, description, videoService } = req.body
    if (!name || !image || !description || !videoService) return res.status(404).json("Please Fill the Field")
    let user = req.user[0]._id
    userModel.find({user}).then((data) => {
        if(!data) return res.status(404).json("User is not found")
        channel.find({name, description, image}).then((data) => {
            if(data.length) return res.status(404).json("Channel is already exit")
            try {
                const Created = channel.create({ name, image, description, videoService, user })
                res.status(200).json(Created)
            } catch (error) {
                console.log(error)
                res.status(500).json(error.message)
            }
        })
    })
}

module.exports = { createChannel }; 