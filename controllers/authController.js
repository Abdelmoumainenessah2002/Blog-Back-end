const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const bcrypt = require("bcryptjs");

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
  });
  await user.save();

  // @TODO - Send email verification link if user is not verified

  // Return response to client
  return res.status(201).json({ message: "User created successfully" });
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

  // @TODO - Send email verification link if user is not verified

  // generate token jwt
  const token = user.generateAuthToken();

  // Return response to client
  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
