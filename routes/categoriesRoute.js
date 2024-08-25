const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const validateObjectID = require("../middlewares/validateObjectID");

const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controllers/categoriesController");


// api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl);



// api/categories/:id
router.route("/:id").all(validateObjectID).delete(verifyTokenAndAdmin, deleteCategoryCtrl);
module.exports = router;