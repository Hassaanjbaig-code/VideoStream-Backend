const Token = require("../modules/Token.model");
const userModel = require("../modules/User.model");

module.exports = async function ConfirmEmail(req, res, next) {
  try {
    console.log("This is working");

    // Find the token in the database
    const checkToken = await Token.findOne({ token: req.params.token });

    if (!checkToken) {
      return res.status(400).json({
        msg: "Your verification link may have expired. Please click on resend to verify your email.",
      });
    }

    // If the token is found, find the associated user
    const user = await userModel.findOne({
      _id: checkToken._userId,
      email: req.params.email,
    });

    if (!user) {
      return res.status(401).json({
        msg: "We were unable to find a user for this verification. Please sign up!",
      });
    }

    // If the user is already verified
    if (user.isVerified) {
      return res.redirect(process.env.Front_End);
    }

    // Mark the user as verified and save
    user.isVerified = true;
    await user.save();

    return res.redirect(process.env.Front_End);
  } catch (error) {
    console.error("Error confirming email:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};
