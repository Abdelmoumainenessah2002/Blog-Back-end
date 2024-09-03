const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");

/**
 * @desc    Create New Category
 * @route   /api/categories
 * @method  POST
 * @access  Private (only admin)
 */

module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateCategory(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const category = new Category({
        user: req.user.id,
        title: req.body.title,
    });
    
    await category.save();
    res.status(201).json(category);
    }
);


/**
 * @desc    get all categories
 * @route   /api/categories
 * @method  GET
 * @access  public
 */

module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
}
);

/**
 * @desc    Delete Category
 * @route   /api/categories/:id
 * @method  DELETE
 * @access  Private (only admin)
 */

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category Deleted Successfully", categoryId: category._id });
}
);