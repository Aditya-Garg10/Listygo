const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  deleteListingImage  // Add this new controller
} = require('../controllers/listings');

// Add proper content-type handling for multipart form data
router.route('/')
  .get(getListings)
  .post(protect, authorize('admin', 'super-admin'), createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('admin', 'super-admin'), updateListing)
  .delete(protect, authorize('super-admin','admin'), deleteListing);

// New route for deleting individual images
router.route('/:id/images')
  .delete(protect, authorize('admin', 'super-admin'), deleteListingImage);

module.exports = router;