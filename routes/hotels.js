const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotels');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const Hotel = require('../models/Hotel');

router
  .route('/')
  .get(getHotels)
  .post(protect, authorize('admin', 'super-admin'), createHotel);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'super-admin'), updateHotel)
  .delete(protect, authorize('admin', 'super-admin'), deleteHotel);

// @desc    Get hours for a specific hotel
// @route   GET /api/hotels/:id/hours
// @access  Public
router.get('/:id/hours', asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).select('hours');
  
  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: 'Hotel not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: hotel.hours || {}
  });
}));

module.exports = router;