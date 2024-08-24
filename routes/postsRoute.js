const router = require("express").Router();

const photoUpload = require("../middlewares/photoUpload");
const {verifyToken} = require("../middlewares/verifyToken");

const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
} = require("../controllers/postController");

const validateObjectID = require("../middlewares/validateObjectID");



// /api/posts
router.route("/").post(verifyToken, photoUpload.single("image"), createPostCtrl)
                 .get(getAllPostsCtrl);


// 
router.route("/count").get(getPostsCountCtrl);

// /api/posts/:id
router.route("/:id").get(validateObjectID, getSinglePostCtrl);



// export the router
module.exports = router;