const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('super-admin'), registerAdmin);
router.post('/login', loginAdmin);
router.get('/logout', logoutAdmin);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;