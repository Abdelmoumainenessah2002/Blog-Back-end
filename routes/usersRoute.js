const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl } = require("../controllers/usersController");
const {verifyTokenAndAdmin, verifyTokenAnd1OnlyUser} = require("../middlewares/verifyToken");
const validateObjectID = require("../middlewares/validateObjectID");

// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);
router.route("/profile/:id").get(validateObjectID, getUserProfileCtrl)
                            .put(validateObjectID,verifyTokenAnd1OnlyUser, updateUserProfileCtrl);


// api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);
module.exports = router;