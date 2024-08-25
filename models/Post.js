const mongoose = require('mongoose');
const Joi = require('joi');

// Post Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1024,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


// Post Schema Virtuals
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'postId',
    localField: '_id'
});

// Post Model
const Post = mongoose.model('Post', postSchema);


// Validate Create Post
function validateCreatePost(post) {
    const schema = Joi.object({
      title: Joi.string().min(6).max(255).trim().required(),
      description: Joi.string().min(10).trim().required(),
      category: Joi.string().trim().required(),
    });
    return schema.validate(post);
}

// Validate Update Post
function validateUpdatePost(post) {
    const schema = Joi.object({
      title: Joi.string().min(6).max(255).trim(),
      description: Joi.string().min(10).trim(),
      category: Joi.string().trim(),
    });
    return schema.validate(post);
}

module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}