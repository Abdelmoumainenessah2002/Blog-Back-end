const fs =  require('fs');
const path = require('path');
const { Post, validateCreatePost, validateUpdatePost } = require("../models/Post");
const asyncHandler = require('express-async-handler');
const {User} = require('../models/User');
const { cloudinaryUploadImage } = require('../utils/Cloudinary');


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
    const post = await Post.findById(req.params.id).populate('user', '-password');
    
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