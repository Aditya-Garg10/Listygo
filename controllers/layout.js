const Layout = require('../models/Layout');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'tmp/uploads/layout';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `layout_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png and .webp files are allowed'));
    }
  }
}).single('file');

// @desc    Get layout content
// @route   GET /api/layout
// @access  Public
exports.getLayout = asyncHandler(async (req, res, next) => {
  // Find layout or create if doesn't exist
  let layout = await Layout.findOne();
  
  if (!layout) {
    layout = await Layout.create({});
  }
  
  res.status(200).json({
    success: true,
    data: layout
  });
});

// @desc    Update layout content
// @route   POST /api/layout
// @access  Private (Admin)
exports.updateLayout = asyncHandler(async (req, res, next) => {
  // Find layout or create if doesn't exist
  let layout = await Layout.findOne();
  
  if (!layout) {
    layout = await Layout.create(req.body);
  } else {
    // Update with new values
    layout.large1 = req.body.large1 || layout.large1;
    layout.large2 = req.body.large2 || layout.large2;
    layout.small1 = req.body.small1 || layout.small1;
    layout.small2 = req.body.small2 || layout.small2;
    layout.small3 = req.body.small3 || layout.small3;
    layout.lastUpdated = Date.now();
    
    await layout.save();
  }
  
  res.status(200).json({
    success: true,
    data: layout
  });
});

// @desc    Upload layout image
// @route   POST /api/layout/upload-image
// @access  Private (Admin)
exports.uploadLayoutImage = asyncHandler(async (req, res, next) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(new ErrorResponse(`${err.message}`, 400));
    }
    
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Generate URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/layout/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      url: fileUrl
    });
  });
});
