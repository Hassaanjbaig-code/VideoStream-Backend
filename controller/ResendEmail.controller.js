const userModel = require("../modules/User.model");
const nodemailer = require("nodemailer");
const TokenVerification = require("../modules/Token.model");

module.exports = async function resendLink(req, res, next) {
  try {
    console.log(req.params.email);
    const user = await userModel.findOne({ email: req.params.email });

    // user is not found into database
    if (!user) {
      return res.status(400).json({
        msg: "We were unable to find a user with that email. Make sure your Email is correct!",
      });
    }

    // user has been already verified
    if (user.isVerified) {
      return res
        .status(200)
        .send("This account has been already verified. Please log in.");
    }

    // send verification link
    const tokenFind = await TokenVerification.findOne({ _userId: user._id });
    if (tokenFind) {
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "maxime78@ethereal.email",
          pass: "KzT4B37KbwenV62bs5",
        },
      });

      let info = await transporter.sendMail({
        from: "no-reply@example.com",
        to: user.email,
        subject: "Account Verification Link",
        // text: `Hello ${user.name},\n\nPlease verify your account by clicking the link: \nhttp://${req.headers.host}/confirmation/${user.email}/${tokenFind.token}\n\nThank You!\n`,
        html: `Hello ${user.email},\n\nPlease verify your account by clicking the link: <a href="http://${req.headers.host}/confirmation/${user.email}/${tokenFind.token}">CLick me</a> You!\n`,
      });

    //   console.log("Message is sent: %s", info);
      return res.status(200).json({ msg: `Check your mail ${info.messageId}` });
    } else {
      return res.status(205).json({ msg: "Please Sign Up" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
