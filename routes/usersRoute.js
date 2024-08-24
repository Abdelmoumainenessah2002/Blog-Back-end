const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");

const {verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization} = require("../middlewares/verifyToken");
const validateObjectID = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/photoUpload");

// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// /api/users/profile/:id
router.route("/profile/:id").get(validateObjectID, getUserProfileCtrl)
                            .put(validateObjectID,verifyTokenAndOnlyUser, updateUserProfileCtrl)
                            .delete(validateObjectID,verifyTokenAndAuthorization, deleteUserProfileCtrl);
// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
      .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl); // Single is used to upload single file


// api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);
module.exports = router;