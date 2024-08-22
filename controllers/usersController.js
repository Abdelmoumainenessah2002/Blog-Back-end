const asyncHandler = require("express-async-handler");
const { User, validateUserProfileUpdate } = require("../models/User");
const bcrypt = require("bcryptjs");
const { set } = require("mongoose");

/**
 * @desc    Get all users profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});




/**
 * @desc    Get user Profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});





/**
 * @desc    Update user Profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 */

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  // validate user profile update
  const { error } = validateUserProfileUpdate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  // check if user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: user.password,
          Bio: req.body.Bio,
        },
      },
      { new: true }
    )
    .select("-password");

  res.status(200).json(updatedUser);
});




/**
 * @desc    Get users count
 * @route   /api/users/count
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});