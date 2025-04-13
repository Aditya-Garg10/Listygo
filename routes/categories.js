const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');

router.route('/')
  .get(getCategories)
  .post(protect, authorize('super-admin'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('super-admin'), updateCategory)
  .delete(protect, authorize('super-admin'), deleteCategory);

module.exports = router;