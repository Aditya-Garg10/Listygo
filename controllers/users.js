const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Utility function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from user object before sending
  const userResponse = user.toObject();
  delete userResponse.password;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userResponse // Send user data along with token
    });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone // Include phone if provided during registration
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/users/logout
// @access  Private (requires token)
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user.id);

  if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details (profile info, preferences)
// @route   PUT /api/users/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // Fields allowed to be updated
  const { name, email, phone, avatar, preferences } = req.body;
  const fieldsToUpdate = {};

  if (name) fieldsToUpdate.name = name;
  if (email) fieldsToUpdate.email = email;
  if (phone) fieldsToUpdate.phone = phone;
  if (avatar) fieldsToUpdate.avatar = avatar;
  if (preferences) fieldsToUpdate.preferences = preferences; // Update nested preferences

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true, // Return the updated document
    runValidators: true // Run schema validators on update
  });

  if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user password
// @route   PUT /api/users/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
  }

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Incorrect current password', 401));
  }

  // Set new password and save (triggers pre-save hook for hashing)
  user.password = newPassword;
  await user.save();

  // Don't need to send token again, just confirmation
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/deleteaccount
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
    }

    // Optional: Add password confirmation step here if needed
    // const { password } = req.body;
    // if (!password || !(await user.matchPassword(password))) {
    //     return next(new ErrorResponse('Incorrect password for account deletion', 401));
    // }

    await user.deleteOne(); // Use deleteOne() on the document

    // Clear cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
    });
});

/**
 * GET /api/users/payment-methods
 * Private - Fetch payment methods for the current user
 */
exports.getPaymentMethods = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user.paymentMethods
  });
});

/**
 * POST /api/users/payment-methods
 * Private - Add a new payment method
 * Expects fields: { cardholderName, cardNumber, expiryMonth, expiryYear, cardType }
 * For security, store only last 4 digits from cardNumber
 */
exports.addPaymentMethod = asyncHandler(async (req, res, next) => {
  const { cardholderName, cardNumber, expiryMonth, expiryYear, cardType } = req.body;

  if (!cardholderName || !cardNumber || !expiryMonth || !expiryYear) {
    return next(new ErrorResponse('Missing required payment method fields', 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const last4 = cardNumber.slice(-4);
  // Optionally check if there's already a default card. If not, this new one becomes default if user chooses so
  const newMethod = {
    cardholderName,
    last4,
    expiryMonth,
    expiryYear,
    cardType: cardType || 'visa',
    isDefault: false
  };

  user.paymentMethods.push(newMethod);
  await user.save();

  res.status(201).json({
    success: true,
    data: user.paymentMethods
  });
});

/**
 * PUT /api/users/payment-methods/:methodId/default
 * Private - Set a payment method as default
 */
exports.setDefaultPaymentMethod = asyncHandler(async (req, res, next) => {
  const { methodId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const paymentMethod = user.paymentMethods.id(methodId);
  if (!paymentMethod) {
    return next(new ErrorResponse('Payment method not found', 404));
  }

  // First, reset all to false, then set this one to true
  user.paymentMethods.forEach((m) => {
    m.isDefault = false;
  });
  paymentMethod.isDefault = true;

  await user.save();
  res.status(200).json({
    success: true,
    data: user.paymentMethods
  });
});

/**
 * DELETE /api/users/payment-methods/:methodId
 * Private - Remove a payment method
 */
exports.deletePaymentMethod = asyncHandler(async (req, res, next) => {
  const { methodId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const paymentMethod = user.paymentMethods.id(methodId);
  if (!paymentMethod) {
    return next(new ErrorResponse('Payment method not found', 404));
  }

  paymentMethod.remove(); // Remove it from the subdocument array
  await user.save();

  res.status(200).json({
    success: true,
    data: user.paymentMethods
  });
});