const Listing = require('../models/Listing');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  console.log("💡 createListing called", req.body); // ✅ Add this

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
    console.log('Backend received location query:', locationQuery);
    
    // Use a more flexible matching approach
    queryObj.location = { $regex: locationQuery, $options: 'i' };
    
    // Log the query we're about to execute
    console.log('Location filter query:', JSON.stringify(queryObj));
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
  // Add user to req.body
  req.body.addedBy = req.user.id;

  // Check if category exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
      );
    }
  }

  const listing = await Listing.create(req.body);

  res.status(201).json({
    success: true,
    data: listing
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if changing category and if new category exists
  if (req.body.category && req.body.category !== listing.category.toString()) {
    const category = await Category.findById(req.body.category);
    
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
      );
    }
  }

  // Make sure user is listing owner or admin
  if (listing.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this listing`,
        401
      )
    );
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: listing
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