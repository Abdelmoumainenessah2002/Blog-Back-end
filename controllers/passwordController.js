const asyncHandler = require("express-async-handler");
const {User, validateEmail, validateNewPassword} = require("../models/User");
const bcrypt = require("bcryptjs");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    send reset Password Link
 * @route   /api/password/reset-password-link
 * @method  POST
 * @access  Public
 */

module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
    // Extract email from req.body
    const { email } = req.body;
    
    // Validation
    const { error } = validateEmail(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    
    // create new verificationtoken & save to database
    let verificationToken = await VerificationToken.findOne({userId: user._id});
    if (!verificationToken) {
        verificationToken = new VerificationToken({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
    }
    await verificationToken.save();

    // making the link unique
    const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;

    // putting the link in html template
    const htmlTemplate = `
    <div>
        <h1> Reset Password </h1>
        <p> Please click the link below to reset your password </p>
        <a href="${link}"> Reset Password </a>
    </div>
    `;

    // Send email
    console.log("Sending email to:", user.email);

    try {
      await sendEmail(
        user.email,
        "Reset Password",
        htmlTemplate,
      );

      return res.status(200).json({ message: "Email sent" });
    } catch (error) {
      return res.status(500).json({ message: "Email could not be sent" });
      console.log(error);
    }
});



/**
 * @desc    Get reset password link
 * @route   /api/password/reset-password/:userId/:token
 * @method  GET
 * @access  Public
 */
module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const verificationToken = await VerificationToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    res.status(200).json({ message: "Valid URL" });
});

/**
 * @desc    Reset password
 * @route   /api/password/reset-password/:userId/:token
 * @method  POST
 * @access  Public
 */
module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    // Validation
    const { error } = validateNewPassword(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Find verification token
    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token,
    });

    if (!verificationToken) {
        return res.status(400).json({ message: "Invalid or expired link" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete verification token
    await VerificationToken.deleteOne({ userId: user._id, token });

    res.status(200).json({ message: "Password reset successful" });
});
