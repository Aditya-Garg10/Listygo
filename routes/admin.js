const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMe,
  updateDetails,
  updatePassword,
  getDashboardData   // Added dashboard function
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
// New dashboard route using real aggregated data
router.get('/dashboard', protect, getDashboardData);

module.exports = router;