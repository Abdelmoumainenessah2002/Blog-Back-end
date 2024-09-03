const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate Posts That belongs to this user when he/she get his/her profile
UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
});

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
  return token;
};

// User Model
const User = mongoose.model("User", UserSchema);

// register user validation
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().trim().required(),
    password: passwordComplexity().required(),
  });

  return schema.validate(obj);
}

// login user validation
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
}

// validate user profile update
function validateUserProfileUpdate(obj) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(100).trim(),
    password: passwordComplexity(),
    bio: Joi.string().trim(),
  });

  return schema.validate(obj);
}

// validate email
function validateEmail(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
  });
  return schema.validate(obj);
}

// validate new password
function validateNewPassword(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required(),  
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUserProfileUpdate,
  validateEmail,
  validateNewPassword,
};
