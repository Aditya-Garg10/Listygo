const Listing = require('../models/Listing');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage directory
const UPLOADS_DIR = 'public/uploads/listings';

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const fileFilter = function(req, file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png and .webp files are allowed'));
  }
};

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
    totalCount: total,
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
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
    fileFilter: fileFilter
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
      
      console.log('Creating listing with locationLink:', req.body.locationLink);

      // Ensure the locationLink field is handled properly
      if (req.body.locationLink === '') {
        req.body.locationLink = null;
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
        // Generate URLs for each uploaded image using local storage
        imageUrls = req.files.map(file => {
          return `${req.protocol}://${req.get('host')}/uploads/listings/${file.filename}`;
        });

        // Add image URLs to req.body
        req.body.images = imageUrls;
      }

      const listing = await Listing.create(req.body);
      
      console.log('Created listing with locationLink:', listing.locationLink);

      res.status(201).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      
      // Clean up any uploaded files if there was an error
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return next(new ErrorResponse(`Failed to create listing: ${error.message}`, 500));
    }
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = asyncHandler(async (req, res, next) => {
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
    fileFilter: fileFilter
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
      if (req.body.locationLink === '') {
        req.body.locationLink = null;
      }

      // Make sure locationLink is included in the update data
      const updateData = { ...req.body };

      // Process images if they were uploaded
      if (req.files && req.files.length > 0) {
        // Generate URLs for each uploaded image
        const newImageUrls = req.files.map(file => {
          return `${req.protocol}://${req.get('host')}/uploads/listings/${file.filename}`;
        });

        // If replaceImages flag is set, replace all images
        if (req.body.replaceImages === 'true') {
          updateData.images = newImageUrls;
        } else {
          // Otherwise append new images to existing ones
          const existingImages = listing.images || [];
          updateData.images = [...existingImages, ...newImageUrls];
        }
      }

      // If imageUrls are provided (from frontend), merge them with existing
      if (req.body.imageUrls) {
        try {
          // Parse imageUrls if it's a string
          const parsedUrls = typeof req.body.imageUrls === 'string' 
            ? JSON.parse(req.body.imageUrls) 
            : req.body.imageUrls;
          
          if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            // If we're not replacing all images and have new uploads too
            if (req.body.replaceImages !== 'true') {
              const existingImages = updateData.images || listing.images || [];
              updateData.images = [...existingImages, ...parsedUrls];
            } else {
              // We're replacing all images
              updateData.images = parsedUrls;
            }
          }
        } catch (err) {
          console.error('Error parsing imageUrls:', err);
        }
      }

      listing = await Listing.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      });

      console.log('Updated listing with locationLink:', listing.locationLink);

      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error updating listing:', error.stack || error.message || error);
      
      // Clean up any uploaded files if there was an error
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return next(new ErrorResponse(`Failed to update listing: ${error.message}`, 500));
    }
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Delete associated image files
  if (listing.images && listing.images.length > 0) {
    listing.images.forEach(imageUrl => {
      try {
        // Extract filename from URL
        const filename = imageUrl.split('/').pop();
        const imagePath = path.join(UPLOADS_DIR, filename);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image file: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete image file: ${err.message}`);
        // Continue with deletion even if file removal fails
      }
    });
  }

  // Delete the listing document
  await listing.deleteOne();

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
    // Delete the local file if possible
    try {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      const imagePath = path.join(UPLOADS_DIR, filename);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      }
    } catch (err) {
      console.error(`Failed to delete image file: ${err.message}`);
      // Continue even if file deletion fails
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