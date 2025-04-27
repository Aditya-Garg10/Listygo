const express = require('express');
const { 
  getLayout, 
  updateLayout, 
  uploadLayoutImage 
} = require('../controllers/layout');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getLayout);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), updateLayout);
router.post('/upload-image', protect, authorize('admin'), uploadLayoutImage);

module.exports = router;
