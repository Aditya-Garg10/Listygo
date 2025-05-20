const Listing = require('../models/Listing');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage directory with better path handling
const UPLOADS_DIR = path.join(__dirname, '../public/uploads/listings');

// Ensure uploads directory exists with proper permissions
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true, mode: 0o755 });
    console.log(`Created directory: ${UPLOADS_DIR}`);
  } catch (err) {
    console.error(`Failed to create directory: ${UPLOADS_DIR}`, err);
  }
}

// Configure multer with better filename handling
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function(req, file, cb) {
    // Create a safer filename that preserves extension
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .substring(0, 40); // Limit base filename length
    
    const finalName = `${Date.now()}_${baseName}${fileExt}`;
    cb(null, finalName);
  }
});

// Better file filtering
const fileFilter = function(req, file, cb) {
  // Check both mimetype and extension
  const filetypes = /jpeg|jpg|png|webp/i;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only .jpeg, .jpg, .png and .webp files are allowed'));
};

// Helper function to get image URL
const getImageUrl = (req, filename) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  return `${protocol}://${req.get('host')}/uploads/listings/${filename}`;
};

// Helper function to clean up files on error
const cleanupFiles = (files) => {
  if (!files) return;
  
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log(`Cleaned up file: ${file.path}`);
      }
    } catch (err) {
      console.error(`Error cleaning up file ${file.path}:`, err);
    }
  });
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
  // Configure multer for this specific request
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit - reduced for reliability
    fileFilter: fileFilter
  }).array('images', 10); // Allow up to 10 images

  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(new ErrorResponse(`${err.message}`, 400));
    }

    try {
      // Add user to req.body
      req.body.addedBy = req.user.id;
      
      // Ensure the locationLink field is handled properly
      if (!req.body.locationLink || req.body.locationLink === '') {
        req.body.locationLink = null;
      }

      // Check if category exists
      if (req.body.category) {
        const category = await Category.findById(req.body.category);
        
        if (!category) {
          cleanupFiles(req.files);
          return next(
            new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
          );
        }
      }

      // Process images if they were uploaded
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        // Generate URLs for each uploaded image
        imageUrls = req.files.map(file => getImageUrl(req, file.filename));
        
        // Set the images in the request body
        req.body.images = imageUrls;
      } else if (req.body.imageUrls) {
        // Handle case when image URLs are provided directly
        try {
          const parsedUrls = typeof req.body.imageUrls === 'string'
            ? JSON.parse(req.body.imageUrls)
            : req.body.imageUrls;
            
          if (Array.isArray(parsedUrls)) {
            req.body.images = parsedUrls;
          }
        } catch (err) {
          console.error('Error parsing imageUrls:', err);
        }
      }

      // Create the listing
      const listing = await Listing.create(req.body);
      
      res.status(201).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      
      // Clean up any uploaded files if there was an error
      cleanupFiles(req.files);
      
      return next(new ErrorResponse(`Failed to create listing: ${error.message}`, 500));
    }
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = asyncHandler(async (req, res, next) => {
  // Configure multer for this specific request
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: fileFilter
  }).array('images', 10); // Allow up to 10 images

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
        cleanupFiles(req.files);
        return next(
          new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
      }

      // Authorization check
      if (listing.addedBy.toString() !== req.user.id && 
          req.user.role !== 'admin' && 
          req.user.role !== 'super-admin') {
        cleanupFiles(req.files);
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this listing`,
            401
          )
        );
      }
      
      // Handle location link - explicit null if empty string
      if (req.body.locationLink === '') {
        req.body.locationLink = null;
      }

      // Create update data object
      const updateData = { ...req.body };
      
      // IMAGE HANDLING LOGIC - completely rewritten for reliability
      
      // Start with existing images (or empty array)
      let finalImages = [...(listing.images || [])];
      
      // Should we replace all images?
      const shouldReplaceAll = req.body.replaceImages === 'true';
      if (shouldReplaceAll) {
        finalImages = []; // Clear existing images if replacing
      }
      
      // Add newly uploaded images
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map(file => getImageUrl(req, file.filename));
        finalImages = shouldReplaceAll ? newImageUrls : [...finalImages, ...newImageUrls];
      }
      
      // Handle image URLs passed in the request (from frontend)
      if (req.body.imageUrls) {
        try {
          let parsedUrls;
          
          // Handle both string and array formats
          if (typeof req.body.imageUrls === 'string') {
            parsedUrls = JSON.parse(req.body.imageUrls);
          } else if (Array.isArray(req.body.imageUrls)) {
            parsedUrls = req.body.imageUrls;
          }
          
          if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            if (shouldReplaceAll && (!req.files || req.files.length === 0)) {
              // If we're replacing all images and no new uploads, just use the parsed URLs
              finalImages = parsedUrls;
            } else if (!shouldReplaceAll) {
              // If we're not replacing, add these to existing images
              finalImages = [...finalImages, ...parsedUrls];
            }
          }
        } catch (err) {
          console.error('Error parsing imageUrls:', err);
        }
      }
      
      // Handle removing a specific image if removeImage is provided
      if (req.body.removeImage) {
        const imageToRemove = req.body.removeImage;
        console.log('Removing specific image:', imageToRemove);
        
        // Get a fresh copy of the listing to avoid stale data issues
        const freshListing = await Listing.findById(req.params.id);
        
        if (freshListing && freshListing.images && 
            freshListing.images.some(img => img === imageToRemove)) {
          // Create a new array without the specified image
          const updatedImages = freshListing.images.filter(img => img !== imageToRemove);
          console.log(`Image removed. Remaining images: ${updatedImages.length}`);
          
          // Ensure we have at least one image
          if (updatedImages.length === 0) {
            return next(
              new ErrorResponse('Cannot delete the last image. Listings must have at least one image.', 400)
            );
          }
          
          // Update the listing directly with the new images array
          const updated = await Listing.findByIdAndUpdate(
            req.params.id,
            { images: updatedImages },
            { new: true, runValidators: true }
          );
          
          if (updated) {
            return res.status(200).json({
              success: true,
              data: updated,
              message: 'Image successfully removed'
            });
          }
        } else {
          console.log('Image not found in listing');
          return next(
            new ErrorResponse('Image not found in this listing', 404)
          );
        }
      }
      
      // Handle exact image removal (for Firebase/external URLs)
      if (req.body.exactImageToRemove) {
        const imageToRemove = req.body.exactImageToRemove;
        console.log('Removing exact image:', imageToRemove);
        
        // Get a fresh copy of the listing
        const freshListing = await Listing.findById(req.params.id);
        
        if (freshListing && freshListing.images) {
          console.log('Original images count:', freshListing.images.length);
          
          // CRITICAL FIX: First deduplicate the images array
          const uniqueImages = [...new Set(freshListing.images)];
          console.log('After deduplication:', uniqueImages.length);
          
          // Then remove the specific image
          const updatedImages = uniqueImages.filter(img => img !== imageToRemove);
          console.log('After removal:', updatedImages.length);
          
          // Ensure we have at least one image
          if (updatedImages.length === 0) {
            return next(
              new ErrorResponse('Cannot delete the last image. Listings must have at least one image.', 400)
            );
          }
          
          // Update the listing with deduplicated & filtered images
          const updated = await Listing.findByIdAndUpdate(
            req.params.id,
            { images: updatedImages },
            { new: true, runValidators: true }
          );
          
          if (updated) {
            return res.status(200).json({
              success: true,
              data: updated
            });
          }
        }
      }
      
      // Deduplicate images (in case of duplicates)
      finalImages = [...new Set(finalImages)];
      
      // Set the final images array to update data
      updateData.images = finalImages;

      // Update the listing
      listing = await Listing.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      
      // Clean up any uploaded files if there was an error
      cleanupFiles(req.files);
      
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
  console.log('DELETE /api/listings/:id/images called with ID:', req.params.id);
  console.log('Request body:', req.body);
  
  // Debug the incoming request
  console.log('Received delete image request:');
  console.log('- Listing ID:', req.params.id);
  console.log('- Body:', JSON.stringify(req.body));
  console.log('- Auth user:', req.user.id);

  // Add this helper function to normalize URLs for comparison
  const normalizeUrls = (urls) => {
    if (!Array.isArray(urls)) return [];
    
    // Normalize each URL for consistent comparison
    return urls.map(url => {
      if (!url) return '';
      
      // Convert to string if not already
      const urlStr = String(url);
      
      // Basic normalization - remove trailing slashes, decode entities
      return decodeURIComponent(urlStr)
        .trim()
        .replace(/\/+$/, '')  // Remove trailing slashes
        .replace(/\\/g, '/'); // Convert backslashes to forward slashes
    });
  };

  try {
    // Get the listing with a fresh query to avoid stale data
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      console.log(`Listing not found with ID: ${req.params.id}`);
      return next(
        new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
      );
    }
    
    // Check authorization
    if (listing.addedBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'super-admin') {
      return next(
        new ErrorResponse(`Not authorized to update this listing`, 401)
      );
    }
    
    // Make sure imageUrl is provided in the request body
    const { imageUrl } = req.body;
    if (!imageUrl) {
      console.log('Missing imageUrl in request body');
      return next(
        new ErrorResponse('Please provide the image URL to delete', 400)
      );
    }

    console.log('Looking for image URL to delete:', imageUrl);
    
    // Get current images
    const currentImages = listing.images || [];
    console.log('Current images count:', currentImages.length);

    // Get normalized versions for comparison
    const normalizedCurrentImages = normalizeUrls(currentImages);
    const normalizedTargetUrl = normalizeUrls([imageUrl])[0];

    console.log('Target URL (normalized):', normalizedTargetUrl);

    // Find the image index
    let imageIndex = -1;

    // First try exact match
    imageIndex = currentImages.findIndex(img => img === imageUrl);

    // If no exact match, try normalized comparison
    if (imageIndex === -1) {
      imageIndex = normalizedCurrentImages.findIndex(
        img => img === normalizedTargetUrl
      );
      
      // If still no match, try partial match for Firebase URLs
      if (imageIndex === -1 && (
          imageUrl.includes('firebasestorage.googleapis.com') || 
          imageUrl.includes('cloudinary.com'))
      ) {
        // For Firebase URLs, sometimes query parameters change
        // Match only the path part without query parameters
        const getUrlPath = (url) => {
          try {
            return url.split('?')[0];
          } catch (e) {
            return url;
          }
        };
        
        const targetPath = getUrlPath(normalizedTargetUrl);
        imageIndex = normalizedCurrentImages.findIndex(img => 
          getUrlPath(img) === targetPath
        );
      }
    }

    if (imageIndex === -1) {
      console.log('Image not found in listing. Available images:');
      currentImages.forEach((img, idx) => {
        console.log(`[${idx}] ${img}`);
      });
      return next(
        new ErrorResponse('Image not found in this listing', 404)
      );
    }
    
    // Make sure we don't delete the last image
    if (currentImages.length <= 1) {
      return next(
        new ErrorResponse('Cannot delete the last image. Listings must have at least one image.', 400)
      );
    }
    
    // Try to delete the physical file if it's stored locally
    try {
      // Extract filename from URL
      let filename;
      
      if (imageUrl.includes('/uploads/listings/')) {
        // Extract filename from URL path
        filename = imageUrl.split('/uploads/listings/').pop();
      } else {
        try {
          const urlObj = new URL(imageUrl);
          const pathname = urlObj.pathname;
          filename = path.basename(pathname);
        } catch (parseErr) {
          // Fallback to simple split if URL parsing fails
          filename = imageUrl.split('/').pop();
        }
      }
      
      console.log('Extracted filename:', filename);
      const imagePath = path.join(UPLOADS_DIR, filename);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.log(`Image file not found at path: ${imagePath}. Only removing from database.`);
      }
    } catch (err) {
      console.error(`Failed to delete physical image file: ${err.message}`);
      // Continue even if file deletion fails - we still want to update the DB
    }
    
    // Create a new array without the deleted image (using direct splice for clarity)
    const updatedImages = [...currentImages];
    updatedImages.splice(imageIndex, 1);
    
    console.log('Images before deletion:', currentImages.length);
    console.log('Images after deletion:', updatedImages.length);
    
    // Update the listing with the new images array
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { images: updatedImages },
      { new: true, runValidators: true }
    );
    
    if (!updatedListing) {
      return next(
        new ErrorResponse(`Failed to update listing after image deletion`, 500)
      );
    }
    
    console.log('Final images count:', updatedListing.images.length);
    
    // Update the response to include more data
    res.status(200).json({
      success: true,
      message: "Image successfully deleted",
      data: updatedListing,
      deletedImage: imageUrl,
      remainingImages: updatedListing.images
    });
  } catch (error) {
    console.error("Error in deleteListingImage:", error);
    return next(
      new ErrorResponse(`Failed to delete image: ${error.message}`, 500)
    );
  }
});

// Add this utility function in your listings controller:
exports.deduplicateImages = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    // Single listing cleanup
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return next(
        new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
      );
    }
    
    // Check if user is authorized
    if (listing.addedBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'super-admin') {
      return next(
        new ErrorResponse(`Not authorized to modify this listing`, 401)
      );
    }
    
    if (listing.images) {
      const originalCount = listing.images.length;
      const uniqueImages = [...new Set(listing.images)];
      
      if (uniqueImages.length < originalCount) {
        console.log(`Removing ${originalCount - uniqueImages.length} duplicate images`);
        
        await Listing.findByIdAndUpdate(
          req.params.id,
          { images: uniqueImages },
          { runValidators: true }
        );
        
        return res.status(200).json({
          success: true,
          message: `Removed ${originalCount - uniqueImages.length} duplicate images`,
          data: { originalCount, newCount: uniqueImages.length }
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'No duplicate images found',
          data: { originalCount, newCount: uniqueImages.length }
        });
      }
    }
  } else {
    // Bulk operation for all listings
    const listings = await Listing.find({});
    const results = [];
    
    for (const listing of listings) {
      if (listing.images) {
        const originalCount = listing.images.length;
        const uniqueImages = [...new Set(listing.images)];
        
        if (uniqueImages.length < originalCount) {
          await Listing.findByIdAndUpdate(
            listing._id,
            { images: uniqueImages },
            { runValidators: true }
          );
          
          results.push({
            id: listing._id,
            removed: originalCount - uniqueImages.length,
            originalCount,
            newCount: uniqueImages.length
          });
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Processed ${listings.length} listings, removed duplicates from ${results.length} listings`,
      data: results
    });
  }
});