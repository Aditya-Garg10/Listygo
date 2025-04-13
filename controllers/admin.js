const Admin = require('../models/Admin');
const User = require('../models/User');
const Hotel = require('../models/Hotel'); // In case you want to include hotel stats in the future
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register admin
// @route   POST /api/v1/admin/register
// @access  Private/SuperAdmin
exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    role: role || 'admin'
  });

  sendTokenResponse(admin, 201, res);
});

// @desc    Login admin
// @route   POST /api/v1/admin/login
// @access  Public
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(admin, 200, res);
});

// @desc    Log admin out / clear cookie
// @route   GET /api/v1/admin/logout
// @access  Private
exports.logoutAdmin = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in admin
// @route   GET /api/v1/admin/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin details
// @route   PUT /api/v1/admin/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const admin = await Admin.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update password
// @route   PUT /api/v1/admin/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.user.id).select('+password');

  // Check current password
  if (!(await admin.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  admin.password = req.body.newPassword;
  await admin.save();

  sendTokenResponse(admin, 200, res);
});

// @desc    Get dashboard data for admin
// @route   GET /api/v1/admin/dashboard
// @access  Private
exports.getDashboardData = asyncHandler(async (req, res, next) => {
  // Total users from the User collection
  const totalUsers = await User.countDocuments();

  // Total hotels: count documents in the Hotel collection
  const totalHotels = await Hotel.countDocuments();

  // Active sessions - using a real session store is ideal.
  // For now, we return 0.
  const activeSessions = 0;

  // Recent users: last 5 registered users, selecting key fields
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  // Recent hotels: list last 5 hotels from the Hotel collection
  const recentHotels = await Hotel.find()        

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalHotels,
      activeSessions,
      recentUsers,
      recentHotels
    }
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Use secure cookie in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
};