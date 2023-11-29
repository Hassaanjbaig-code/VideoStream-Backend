const express = require("express")
const body_Parser = require("body-parser")
const jsonParser = body_Parser.json()
const bcript = require("bcryptjs")
const userModel = require("../modules/User.model")
const routes = express.Router()
const GenerateJson = require("./../controller/GenerateJson")
const channelModel = require("../modules/Channal.model")
const VerifyJson = require("../controller/VerifyJson")
const User = require("../controller/User.controller")

routes.get("/ChannelDetail", VerifyJson, User)


routes.post("/SignUp", jsonParser, async (req, res) => {
    let { name, email, password } = req.body;
    
    // Check if any of the fields are missing
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill out all the fields",
        });
    }

    // Trim the input values
    name = name.trim();
    email = email.trim();
    password = password.trim();

    // Check if the email is valid
    if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.status(400).json({
            message: "Name is not valid",
        });
    }
    
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({
            message: "Email is not valid",
        });
    }

    // Check if a user with the same email already exists
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        // If no existing user found, hash the password and create a new user
        const saltRounds = 10;
        const hashedPassword = await bcript.hash(password, saltRounds);

        const newUser = new userModel({
            user: name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User is created",
            status: 201,
            user: savedUser,
        });
    } catch (err) {
        res.status(500).json({
            message: `Error while creating user: ${err}`,
            status: 500,
        });
    }
});

routes.post("/LogIn", jsonParser, (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        res.status(404).json("Please Fill the Field")
    }
    email = email.trim()
    userModel.find({email}).then(data => {
        const hashpassword = data[0].password
        bcript.compare(password, hashpassword).then(async (result) => {
            if (result) {
                const token = GenerateJson(data)
                // console.log(data[0]._id)
                const channel = await channelModel.find({ user: data[0]._id })
                console.log(channel.length)
                if (channel.length > 0) {
                    console.log(channel[0]._id)
                    res.status(200).json({
                        status: 200,
                        message: `You are LogIn`,
                        token,
                        channel: {
                            status: 200,
                            message: channel[0]._id,
                        },
                        status: 200
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        message: `You are LogIn`,
                        token,
                        channel: {
                            status: 404,
                            messgae: "Channel Not Found"
                        }
                    })
                }
            } else {
                res.status(404).json({
                    message: "Password is Incorrect",
                    status: 404
                })
            }
        }).catch(err => res.status(404).json(err))
    }).catch(err => res.status(404).json({
        message: err,
        status: 404
    }))
})


routes.get("/", jsonParser , (req, res) => {
    res.status(200).json("Working")
})


module.exports = routes

