const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const validateObjectID = require("../middlewares/validateObjectID");
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/commentsController");

// api/comments
router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyTokenAndAdmin, getAllCommentsCtrl);

// api/comments/:id
router.route("/:id").delete(validateObjectID, verifyToken, deleteCommentCtrl)
                    .put(validateObjectID, verifyToken, updateCommentCtrl);

module.exports = router;
