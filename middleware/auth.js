const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  } 
  // If no token in header, check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in both User and Admin collections
    let user = await User.findById(decoded.id);
    let isAdmin = false;

    // If not found in User collection, check Admin collection
    if (!user) {
      user = await Admin.findById(decoded.id);
      isAdmin = !!user; // Set to true if found in Admin collection
    }
    
    // If user not found in either collection
    if (!user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    
    // Add user and admin status to request
    req.user = user;
    req.isAdmin = isAdmin;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    
    // For admin users, check roles
    if (req.isAdmin && roles.includes(req.user.role)) {
      return next();
    }
    
    // For regular users, check if 'user' role is allowed
    if (!req.isAdmin && roles.includes('user')) {
      return next();
    }
    
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
  };
};