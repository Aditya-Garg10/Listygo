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

router
  .route('/')
  .get(getHotels)
  .post(protect, authorize('admin', 'super-admin'), createHotel);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'super-admin'), updateHotel)
  .delete(protect, authorize('admin', 'super-admin'), deleteHotel);

module.exports = router;