const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      trim: true,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },
    Bio: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
  return token;
};

// User Model
const User = mongoose.model("User", UserSchema);


// register user validation
function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().min(2).max(100).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).trim().required(),
  });

  return schema.validate(obj);
};


// login user validation
function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().trim().required(),
  });

  return schema.validate(obj);
};

module.exports = { User, validateRegisterUser, validateLoginUser };
