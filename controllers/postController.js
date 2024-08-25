const fs =  require('fs');
const path = require('path');
const { Post, validateCreatePost, validateUpdatePost } = require("../models/Post");
const asyncHandler = require('express-async-handler');
const {User} = require('../models/User');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/Cloudinary');
const {Comment} = require('../models/Comment');

 /**
 * @desc    Create new post
 * @route   /api/posts
 * @method  POST
 * @access  private (only logged in user)
 */

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
    // 1- valite the image
    if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
    }

    // 2- validate the post data
    const { error } = validateCreatePost(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // 3- upload the image to cloudinary
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 4- create the post and save it to the database
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user : req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }
    });

    // 5- send the post as a response
    res.status(201).json(post);

    // 6- remove the image from the server
    fs.unlinkSync(imagePath);
}   
);

/**
 * @desc    Get all posts
 * @route   /api/posts
 * @method  GET
 * @access  public
*/

module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
    const POST_PER_PAGE = 3;
    const {pageNumber, category} = req.query;
    let posts;

    if (pageNumber) {
        posts = await Post.find()
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * POST_PER_PAGE) // 0, 3, 6, 9
          .limit(POST_PER_PAGE) // 3
          .populate("user", "-password"); // exclude the password field from the user object
    }
    
    else if (category) {
        posts = await Post.find({ category: category })
          .sort({ createdAt: -1 })
          .populate("user", "-password"); // exclude the password field from the user object
    
    } else {
        posts = await Post.find().sort({createdAt: -1})
        .populate('user', '-password'); // exclude the password field from the user object
    }

    res.status(200).json(posts);
}
);
    

/**
 * @desc    Get single post
 * @route   /api/posts/:id
 * @method  GET
 * @access  public
*/
    
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate("user", "-password")
      .populate("comments");
    
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json(post);
}   
);


/**
 * @desc    Get posts count
 * @route   /api/posts/count
 * @method  GET
 * @access  private (only admin)
*/

module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
    const count = await Post.countDocuments();  
    res.status(200).json(count);
}
);

/**
 * @desc    Delete post
 * @route   /api/posts/:id
 * @method  DELETE
 * @access  private (only admin or the user who created the post)
*/


module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  // check if the user is the owner of the post or an admin
  if (req.user.isAdmin || post.user.id.toString() === req.user.id) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);

    // @TODO: remove all the comments related to this post
    await Comment.deleteMany({ postId: post._id });

    return res.status(200).json({ message: "Post deleted successfully",postId: post._id });
  }

  else {
    return res.status(403).json({ message: "You are not authorized to delete this post, forbidden" });
  }
});


/**
 * @desc    Update post
 * @route   /api/posts/:id
 * @method  PUT
 * @access  private (only the user who created the post)
*/

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
    // 1- validate the post data
    const { error } = validateUpdatePost(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // 2- find the post
    let post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // 3- check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this post, forbidden" });
    }

    // 4- update the post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    }, { new: true }).populate('user', '-password');

    res.status(200).json(updatedPost);
}
);


/**
 * @desc    Update post image
 * @route   /api/posts/upload-image/:id
 * @method  PUT
 * @access  private (only the user who created the post)
*/

module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // 1- validate the post data

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  // 2- find the post
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // 3- check if the user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return res
      .status(403)
      .json({
        message: "You are not authorized to update this post, forbidden",
      });
  }

  // 4- Delete the old post image
  console.log(post.image.publicId);
  await cloudinaryRemoveImage(post.image.publicId);

  // 5- upload the new post image

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // 6- update the image field in the data base
  // 4- update the post
  const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
      $set: {
        image : {
            url: result.secure_url,
            publicId: result.public_id
        }
      }
    },
    { new: true }
  );

  // 7- send the response
  res.status(200).json(updatedPost);

  // 8- remove the photo from the server
  fs.unlinkSync(imagePath);
}
);



/**
 * @desc    Toggle Like 
 * @route   /api/posts/liked/:id
 * @method  PUT
 * @access  private (only logged in user)
*/

module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  
  const loggedInUser = req.user.id;
  const {id: postId} = req.params;

  // 1- find the post
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // 2- check if the user has already liked the post
  const isPostAlreadyLiked = post.likes.find((user)=> user.toString() === loggedInUser);
  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loggedInUser }, // remove the user from the likes array
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }

  res.status(200).json(post);
}
);