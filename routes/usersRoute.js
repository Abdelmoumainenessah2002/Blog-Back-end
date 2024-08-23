const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl } = require("../controllers/usersController");
const {verifyTokenAndAdmin, verifyTokenAnd1OnlyUser, verifyToken} = require("../middlewares/verifyToken");
const validateObjectID = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/photoUpload");

// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// /api/users/profile/:id
router.route("/profile/:id").get(validateObjectID, getUserProfileCtrl)
                            .put(validateObjectID,verifyTokenAnd1OnlyUser, updateUserProfileCtrl);

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
      .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl); // Single is used to upload single file


// api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);
module.exports = router;