const express = require("express");
const body_Parser = require("body-parser");
const jsonParser = body_Parser.json();
const bcrypt = require("bcryptjs");
const userModel = require("../modules/User.model");
const routes = express.Router();
const GenerateJson = require("./../controller/GenerateJson");
const channelModel = require("../modules/Channal.model");
const VerifyJson = require("../controller/VerifyJson");
const User = require("../controller/User.controller");
const TokenVerification = require("../modules/Token.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config();

routes.get("/ChannelDetail", VerifyJson, User);

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

  // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
  //   return res.status(400).json({
  //     message: "Email is not valid",
  //   });
  // }

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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      user: name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = new TokenVerification({
      _userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    token
      .save()
      .then(() => {
        console.log("Token is save");
      })
      .catch((err) => {
        res.status(404).send({ mes: err.message });
      });

    // Sending an email for confirmation

    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      auth: {
        user: process.env.outlook_email,
        pass: process.env.outlook_pass,
      },
    });

    var mailOptions = {
      from: "videoScribe12@hotmail.com",
      to: email,
      subject: "Account Verification Link",
      html: `Hello ${newUser.email},\n\nPlease verify your account by clicking the link: <a href="http://${req.headers.host}/confirmation/${newUser.email}/${token.token}">CLick me</a> You!\n`,
    };
    transporter.sendMail(mailOptions, function (err) {
      console.log(err);
      if (err) {
        return res.status(500).json({
          msg: "Technical Issue!, Please click on resend for verify your Email.",
        });
      }
      return res.status(200).json({
        msg:
          "A verification email has been sent to " +
          newUser.email +
          ". It will be expire after one day. If you not get verification Email click on resend token.",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Error while creating user: ${err}`,
      status: 500,
    });
  }
});

routes.post("/LogIn", jsonParser, async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all fields", status: 400 });
  }
  email = email.trim();
  try {
    const data = await userModel.find({ email });
    if (data.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Email is not registered" });
    }

    const hashpassword = data[0].password;
    const result = await bcrypt.compare(password, hashpassword);
    if (result) {
      const token = GenerateJson(data);
      const channel = await channelModel.find({ user: data[0]._id });
      if (channel.length > 0) {
        return res.status(200).json({
          status: 200,
          message: `You are LogIn`,
          verify: data[0].isVerified,
          token,
          channel: {
            status: 200,
            message: channel[0]._id,
          },
        });
      } else {
        return res.status(200).json({
          status: 200,
          message: `You are LogIn`,
          token,
          verify: data[0].isVerified,
          channel: {
            status: 404,
            message: "Channel Not Found",
          },
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Password is Incorrect", status: 404 });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error ${error}`});
  }
});

routes.get("/", jsonParser, (req, res) => {
  res.status(200).json("Working");
});

module.exports = routes;
