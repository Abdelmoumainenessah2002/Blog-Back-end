const asyncHandler = require("express-async-handler");
const { User, validateUserProfileUpdate } = require("../models/User");
const bcrypt = require("bcryptjs");
const { set } = require("mongoose");
const fs = require("fs");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require("../utils/Cloudinary");
const {Post} = require( '../models/Post');
const {Comment} = require('../models/Comment');

/**
 * @desc    Get all users profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

/**
 * @desc    Get user Profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  public (anyone can access)
 */

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");

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
  ).select("-password");

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





/**
 * @desc    Profile Picture Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only user himself)
 */

module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1- Validate the file
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }

  // 2- Get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3- Upload the image to Cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);

  // 4- Get the user from the database
  const user = await User.findById(req.user.id);

  // 5- Delete the old photo from Cloudinary if exists
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // 6-Update the user's profile photo in the database
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();
  // 7- Send a response to the client
  res
    .status(200)
    .json({
      message: "Profile photo uploaded successfully",
      newProfilePhoto: { url: result.secure_url, publicId: result.public_id },
    });

  // 8- Remove the photo from the server
  fs.unlinkSync(imagePath);

});




/**
 * @desc    Delete Profile (Account)
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 */

module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // check if user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  // 2- Get All posts of the user from the database
  const posts = await Post.find({ user: user._id });
  // 3- Get the public ids of the images of the posts
  const publicIds = posts?.map((post) => post.image.publicId);
  console.log(publicIds);
  // 4- Delete all posts images from Cloudinary that belong to the user
  if (publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }


  // 5- Delete the user profile photo from Cloudinary
  await cloudinaryRemoveImage(user.profilePhoto.publicId);

  // 6- Delete the user posts & comments from the database
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  // 7- Delete the user from the database
  await User.findByIdAndDelete(req.params.id);

  // 8- Send a response to the client
  res.status(200).json({ message: "User deleted successfully" });
});