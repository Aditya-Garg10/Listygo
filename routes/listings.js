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
  uploadImages
} = require('../controllers/listings');



// Add proper content-type handling for multipart form data
router.route('/')
  .get(getListings)
  .post(protect, authorize('admin', 'super-admin'), createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('admin', 'super-admin'), updateListing)
  .delete(protect, authorize('admin', 'super-admin'), deleteListing);


module.exports = router;