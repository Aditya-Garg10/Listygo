const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ active: true }).sort('name');
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  // Check if category with this name already exists
  const existingCategory = await Category.findOne({ name: req.body.name });
  
  if (existingCategory) {
    return next(new ErrorResponse(`Category with name "${req.body.name}" already exists`, 400));
  }
  
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  // If name is changing, check if the new name already exists
  if (req.body.name && req.body.name !== category.name) {
    const existingCategory = await Category.findOne({ name: req.body.name });
    
    if (existingCategory) {
      return next(new ErrorResponse(`Category with name "${req.body.name}" already exists`, 400));
    }
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  // Check if category is in use before deleting
  // const inUse = await Listing.countDocuments({ category: req.params.id });
  
  // if (inUse > 0) {
  //   return next(new ErrorResponse(`Cannot delete category that has listings associated with it`, 400));
  // }

  await category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});