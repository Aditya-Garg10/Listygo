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
  getFeaturedListings
} = require('../controllers/listings');



// after
router.route('/')
  .get(getListings)
  .post(protect, authorize('admin', 'super-admin'), createListing);


router.route('/featured')
  .get(getFeaturedListings);

router.route('/category/:categoryId')
  .get(getListingsByCategory);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('admin', 'super-admin'), updateListing)
  .delete(protect, authorize('admin', 'super-admin'), deleteListing);

module.exports = router;