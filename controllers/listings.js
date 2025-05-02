const Listing = require('../models/Listing');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const admin = require('../config/firebase');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'location'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Parse the query string back to object
  let queryObj = JSON.parse(queryStr);
  
  // Handle search functionality
  if (req.query.search) {
    // Add text search capabilities
    const searchQuery = req.query.search;
    queryObj = {
      ...queryObj,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } }
      ]
    };
  }

  // Handle location filtering
  if (req.query.location) {
    const locationQuery = req.query.location;
    queryObj.location = { $regex: locationQuery, $options: 'i' };
  }

  // Finding resource
  let query = Listing.find(queryObj).populate('category', 'name slug icon');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Listing.countDocuments(queryObj);

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const listings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    totalCount: total, // Add this line to return total count
    pagination,
    data: listings
  });
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate('category', 'name slug icon');

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
exports.createListing = asyncHandler(async (req, res, next) => {
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = 'tmp/uploads/';
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`);
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
  }).array('images', 5); // Allow up to 5 images

  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(new ErrorResponse(`${err.message}`, 400));
    }

    try {
      // Add user to req.body
      req.body.addedBy = req.user.id;

      // Log received data for debugging, especially locationLink
      console.log('Creating listing with locationLink:', req.body.locationLink);

      // Ensure the locationLink field is handled properly
      if (req.body.locationLink === '') {
        req.body.locationLink = null; // Consistent handling of empty strings
      }

      // Check if category exists
      if (req.body.category) {
        const category = await Category.findById(req.body.category);
        
        if (!category) {
          return next(
            new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
          );
        }
      }

      // Process images if they were uploaded
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = await Promise.all(
          req.files.map(async (file) => {
            try {
              const bucket = admin.storage().bucket();
              
              const uploadResponse = await bucket.upload(file.path, {
                destination: `listings/${file.filename}`,
                metadata: {
                  contentType: file.mimetype,
                },
              });
              
              // Get public URL
              const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent('listings/' + file.filename)}?alt=media`;
              
              // Delete the temporary file
              fs.unlinkSync(file.path);
              
              return fileUrl;
            } catch (error) {
              // Cleanup if upload fails
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
              throw error;
            }
          })
        );

        // Add image URLs to req.body
        req.body.images = imageUrls;
      }

      const listing = await Listing.create(req.body);
      
      // Log the created listing to verify locationLink was saved
      console.log('Created listing with locationLink:', listing.locationLink);

      res.status(201).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      return next(new ErrorResponse(`Failed to create listing: ${error.message}`, 500));
    }
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = asyncHandler(async (req, res, next) => {
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = 'tmp/uploads/';
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`);
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
  }).array('images', 5); // Allow up to 5 images

  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(new ErrorResponse(`${err.message}`, 400));
    }

    try {
      // First retrieve the existing listing
      let listing = await Listing.findById(req.params.id);

      if (!listing) {
        return next(
          new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
      }

      // Authorization check
      if (listing.addedBy.toString() !== req.user.id && 
          req.user.role !== 'admin' && 
          req.user.role !== 'super-admin') {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this listing`,
            401
          )
        );
      }

      // Debug output
      console.log('⭐ Update request for listing ID:', req.params.id);
      console.log('⭐ Fields in request:', Object.keys(req.body));
      console.log('⭐ locationLink received:', req.body.locationLink);
      
      // Explicitly handle the locationLink field
      console.log('Processing locationLink for update:', req.body.locationLink);
      
      // Set empty string to null for consistency
      if (req.body.locationLink === '') {
        req.body.locationLink = null;
      }

      // Make sure locationLink is included in the update data
      const updateData = { ...req.body };

      listing = await Listing.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      });

      // Log the updated listing to verify locationLink was saved
      console.log('Updated listing with locationLink:', listing.locationLink);

      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error updating listing:', error.stack || error.message || error);
      return next(new ErrorResponse(`Failed to update listing: ${error.message}`, 500));
    }
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const deleted = await Listing.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});


// @desc    Get listings by category
// @route   GET /api/listings/category/:categoryId
// @access  Public
exports.getListingsByCategory = asyncHandler(async (req, res, next) => {
  // Check if category exists first
  const category = await Category.findById(req.params.categoryId);
  
  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.categoryId}`, 404)
    );
  }
  
  const listings = await Listing.find({ category: req.params.categoryId })
    .populate('category', 'name slug icon');

  res.status(200).json({
    success: true,
    count: listings.length,
    category: {
      id: category._id,
      name: category.name,
      slug: category.slug
    },
    data: listings
  });
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
exports.getFeaturedListings = asyncHandler(async (req, res, next) => {
  // Get featured listings (max 10)
  const listings = await Listing.find({ isFeatured: true })
    .limit(10)
    .sort('-createdAt')
    .populate('category', 'name slug icon');

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// Add this function to your listings controller

// @desc    Delete a specific image from a listing
// @route   DELETE /api/listings/:id/images
// @access  Private
exports.deleteListingImage = asyncHandler(async (req, res, next) => {
  // Get the listing
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check authorization
  if (listing.addedBy.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return next(
      new ErrorResponse(`Not authorized to update this listing`, 401)
    );
  }
  
  // Make sure imageUrl is provided in the request body
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return next(
      new ErrorResponse('Please provide the image URL to delete', 400)
    );
  }
  
  // Check if the image exists in the listing
  if (!listing.images.includes(imageUrl)) {
    return next(
      new ErrorResponse('Image not found in this listing', 404)
    );
  }
  
  // Make sure we don't delete the last image
  if (listing.images.length <= 1) {
    return next(
      new ErrorResponse('Cannot delete the last image. Listings must have at least one image.', 400)
    );
  }
  
  try {
    // Delete from Firebase Storage if it's a Firebase URL
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      // Extract the file path from the URL
      const bucket = admin.storage().bucket();
      
      // Parse the URL to get the file path
      // Example URL format: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/listings%2Ffilename.jpg?alt=media
      const urlPath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
      
      console.log(`Attempting to delete file at path: ${urlPath}`);
      
      // Delete the file from Firebase Storage
      await bucket.file(urlPath).delete()
        .then(() => {
          console.log(`Successfully deleted file: ${urlPath}`);
        })
        .catch((error) => {
          console.error(`Error deleting file from Firebase: ${error.message}`);
          // We continue even if Firebase deletion fails
          // This ensures the URL is at least removed from the database
        });
    }
    
    // Remove the image from the database entry
    listing.images = listing.images.filter(img => img !== imageUrl);
    
    // Save the updated listing
    await listing.save();
    
    res.status(200).json({
      success: true,
      message: "Image successfully deleted",
      data: listing
    });
  } catch (error) {
    console.error("Error in deleteListingImage:", error);
    return next(
      new ErrorResponse(`Failed to delete image: ${error.message}`, 500)
    );
  }
});