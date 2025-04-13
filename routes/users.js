const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateDetails,
  updatePassword,
  deleteAccount,
  // Payment method controllers
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  contactUsHandler
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (require token)
router.get('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.delete('/deleteaccount', protect, deleteAccount);

// Payment method routes
router.get('/payment-methods', protect, getPaymentMethods);
router.post('/payment-methods', protect, addPaymentMethod);
router.put('/payment-methods/:methodId/default', protect, setDefaultPaymentMethod);
router.delete('/payment-methods/:methodId', protect, deletePaymentMethod);

// Contact Us route
router.post('/contact-us', contactUsHandler);

module.exports = router;