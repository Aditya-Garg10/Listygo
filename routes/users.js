const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;