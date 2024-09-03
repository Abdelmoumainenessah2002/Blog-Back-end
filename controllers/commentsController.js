const asyncHandler = require('express-async-handler');
const { Comment, validateCreateComment, validateUpdateComment } = require('../models/Comment');
const { User } = require('../models/User');

 /**
 * @desc    Create new comment
 * @route   /api/comments
 * @method  POST
 * @access  private (only logged in user)
 */

module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
    // 1- validate the comment data
    const { error } = validateCreateComment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const profile = await User.findById(req.user.id); 

    // 2- create the comment and save it to the database
    const comment = await Comment.create({
        postId: req.body.postId,
        user: req.user.id,
        text: req.body.text,
        username: profile.username,
    });

    // 3- send the comment as a response
    res.status(201).json(comment);
}
);


 /**
 * @desc    Get all comments
 * @route   /api/comments
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
    const comments = await Comment.find().populate('user','-password')
    .populate('postId');
    res.status(200).json(comments);
}
);


 /**
 * @desc    Delete comment
 * @route   /api/comments/:id
 * @method  DELETE
 * @access  private (only admin or the user who created the comment)
 */

module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.id === comment.user.toString() || req.user.isAdmin) {
       await Comment.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: 'Comment has been deleted' });
    }
    else {
        res.status(403).json({ message: 'You are not allowed to delete this comment' });
    }  
}
);


 /**
 * @desc    Update comment
 * @route   /api/comments/:id
 * @method  PUT
 * @access  private (only logged in user)
 */

module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
    // 1- validate the comment data
    const { error } = validateUpdateComment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.id !== comment.user.toString()) {
        return res.status(403).json({ message: 'You are not allowed to update this comment' });
    }

    // 2- update the comment and save it to the database
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
        $set: {
            text: req.body.text,
        }
    }, { new: true });



    // 3- send the comment as a response
    res.status(201).json(updatedComment);
}
);