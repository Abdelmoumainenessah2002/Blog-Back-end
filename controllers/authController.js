const asyncHandler = require("express-async-handler");
const {User, validateRegisterUser, validateLoginUser} = require("../models/User");
const bcrypt = require("bcryptjs");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


/**
 * @desc    Register a new user
 * @route   /api/auth/register
 * @method  POST
 * @access  Public
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // Extract variables from req.body
  const { username, email, password } = req.body;

  // Validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user and save to data base
  user = new User({
    username: username,
    email: email,
    password: hashedPassword,
    Bio: "",
  });
  await user.save();

  // create new verificationtoken & save to database
  
  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();
  // making the link unique
  const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;
  // putting the link in html template
  const htmlTemplate = `
  <div> 
    <h1> Welcome to Blog </h1>
    <p> Please click the link below to verify your account </p>
    <a href="${link}"> Verify Account </a>
  </div>
  `
  // sending the email to the user
  await sendEmail(user.email, "Verify Your Email", htmlTemplate );

  // Return response to client
  return res.status(201).json({ message: "We have sent you an email to verify your account" });
});

/**
 * @desc    Login a user
 * @route   /api/auth/login
 * @method  POST
 * @access  Public
 */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // Extract variables from req.body
  const { email, password } = req.body;

  // Validation
  const { error } = validateLoginUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

  // Check if user exists
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if password is correct
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Send email verification link if user is not verified
  if (!user.isAccountVerified) {

      let verificationToken = await VerificationToken.findOne({
        userId: user._id,
      });

      if (!verificationToken) {
        verificationToken = new VerificationToken({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        await verificationToken.save();
      }

      const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;
      
      const htmlTemplate = `
        <div> 
          <h1> Welcome to Blog </h1>
          <p> Please click the link below to verify your account </p>
          <a href="${link}"> Verify Account </a>
        </div>
        `;
      // sending the email to the user
      await sendEmail(user.email, "Verify Your Email", htmlTemplate);

      return res
        .status(400)
        .json({ message: "Your email is not verified, please verify your account" });

  }

  // generate token jwt
  const token = user.generateAuthToken();

  // Return response to client
  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    Bio: user.Bio || "",
    token,
  });
});



/**
 * @desc    verify user email
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  Public
 */

module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  // Extract variables from req.params
  const { userId, token } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid verification link" });
  }

  // verify token
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid verification link" });
  }

  // update user to verified
  user.isAccountVerified = true;
  await user.save();

  // delete verification token
  await VerificationToken.deleteOne({ userId: user._id });

  // Return response to client
  return res.status(200).json({ message: "Your account has been verified" });
});