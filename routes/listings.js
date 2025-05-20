const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getListingsByCategory,
  getFeaturedListings,
  deleteListingImage,
  deduplicateImages
} = require('../controllers/listings');

// Standard routes
router.route('/')
  .get(getListings)
  .post(protect, authorize('admin', 'super-admin'), createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('admin', 'super-admin'), updateListing)
  .delete(protect, authorize('admin', 'super-admin'), deleteListing);

// Image-specific endpoints
router.route('/:id/images')
  .delete(protect, authorize('admin', 'super-admin'), deleteListingImage);

router.route('/:id/deduplicate-images')
  .post(protect, authorize('admin', 'super-admin'), deduplicateImages);

router.route('/deduplicate-all-images')
  .post(protect, authorize('admin', 'super-admin'), deduplicateImages);

// Special routes - put these after the /:id routes to prevent conflicts
router.route('/category/:categoryId').get(getListingsByCategory);
router.route('/featured').get(getFeaturedListings);

module.exports = router;