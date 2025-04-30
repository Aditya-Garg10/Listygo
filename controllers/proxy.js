const axios = require('axios');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Proxy requests to Nominatim API (OpenStreetMap)
 * @route   GET /api/proxy/geocode
 * @access  Public
 */
exports.proxyGeocodeRequest = asyncHandler(async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return next(new ErrorResponse('Query parameter is required', 400));
    }
    
    // Make request to Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 1
      },
      headers: {
        'User-Agent': 'ListyGo Application (contact@listygo.com)',
        'Referer': process.env.FRONTEND_URL || 'http://localhost:5173'
      }
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Geocoding proxy error:', error.message);
    return next(new ErrorResponse('Error fetching geocoding data', 500));
  }
});

/**
 * @desc    Get coordinates for a location query
 * @route   GET /api/proxy/coordinates
 * @access  Public
 */
exports.getCoordinates = asyncHandler(async (req, res, next) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return next(new ErrorResponse('Location parameter is required', 400));
    }
    
    // Make request to Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'ListyGo Application (contact@listygo.com)',
        'Referer': process.env.FRONTEND_URL || 'http://localhost:5173'
      }
    });
    
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      res.status(200).json({
        success: true,
        data: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No coordinates found for this location'
      });
    }
  } catch (error) {
    console.error('Coordinates proxy error:', error.message);
    return next(new ErrorResponse('Error fetching coordinates', 500));
  }
});
