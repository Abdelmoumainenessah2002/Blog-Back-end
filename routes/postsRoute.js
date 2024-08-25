const router = require("express").Router();

const photoUpload = require("../middlewares/photoUpload");
const {verifyToken} = require("../middlewares/verifyToken");

const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImageCtrl,
  toggleLikeCtrl,
} = require("../controllers/postController");

const validateObjectID = require("../middlewares/validateObjectID");



// /api/posts
router.route("/").post(verifyToken, photoUpload.single("image"), createPostCtrl)
                 .get(getAllPostsCtrl);


// 
router.route("/count").get(getPostsCountCtrl);

// /api/posts/:id
router.route("/:id").get(validateObjectID, getSinglePostCtrl)
                    .delete(validateObjectID, verifyToken, deletePostCtrl)
                    .put(validateObjectID, verifyToken, updatePostCtrl);



// /api/posts/upload-image/:id
router.route("/update-image/:id").put(validateObjectID, verifyToken, photoUpload.single("image"), updatePostImageCtrl);


// /api/posts/like/:id
router.route("/like/:id").put(validateObjectID, verifyToken, toggleLikeCtrl);

// export the router
module.exports = router;