import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiDollarSign, FiStar, FiMapPin, FiImage, FiFileText, FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AdminHotels = () => {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState({
    name: '',
    location: '',
    price: '',
    rating: '',
    description: '',
    images: [''] // Initialize with one empty image input
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeImagePreview, setActiveImagePreview] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Check authentication when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || !isAuthenticated || (userRole !== 'admin' && userRole !== 'super-admin')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle changes to image URLs
  const handleImageChange = (index, value) => {
    const newImages = [...hotel.images];
    newImages[index] = value;
    
    setHotel(prevState => ({
      ...prevState,
      images: newImages
    }));
    
    // Clear validation errors
    if (validationErrors.images) {
      setValidationErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  // Add a new image input field
  const addImageField = () => {
    setHotel(prevState => ({
      ...prevState,
      images: [...prevState.images, '']
    }));
  };

  // Remove an image input field
  const removeImageField = (index) => {
    if (hotel.images.length <= 1) {
      setValidationErrors(prev => ({
        ...prev,
        images: 'At least one image is required'
      }));
      return;
    }
    
    const newImages = hotel.images.filter((_, i) => i !== index);
    setHotel(prevState => ({
      ...prevState,
      images: newImages
    }));
    
    // Adjust active preview if needed
    if (activeImagePreview >= newImages.length) {
      setActiveImagePreview(Math.max(0, newImages.length - 1));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!hotel.name) errors.name = 'Hotel name is required';
    if (!hotel.location) errors.location = 'Location is required';
    if (!hotel.price) errors.price = 'Price is required';
    if (hotel.price && isNaN(hotel.price)) errors.price = 'Price must be a number';
    if (!hotel.rating) errors.rating = 'Rating is required';
    if (hotel.rating && (isNaN(hotel.rating) || hotel.rating < 1 || hotel.rating > 5)) {
      errors.rating = 'Rating must be a number between 1 and 5';
    }
    if (!hotel.description) errors.description = 'Description is required';
    
    // Validate images
    const hasValidImage = hotel.images.some(img => img.trim() !== '');
    if (!hasValidImage) {
      errors.images = 'At least one valid image URL is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const filteredImages = hotel.images.filter(img => img.trim() !== '');
    const hotelData = {
      ...hotel,
      images: filteredImages
    };
    
    // Validate the form
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors in the form' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'You must be logged in as admin' });
        setLoading(false);
        navigate('/admin/login');
        return;
      }
      
      // Make API request
      await axios.post(
        `${API_URL}/hotels`, 
        hotelData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Handle success
      setMessage({ type: 'success', text: 'Hotel added successfully!' });
      
      // Clear form
      setHotel({
        name: '',
        location: '',
        price: '',
        rating: '',
        description: '',
        images: ['']
      });
      setActiveImagePreview(0);
    } catch (error) {
      console.error('Error adding hotel:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Authentication failed. Please login again.' });
        setTimeout(() => navigate('/admin/login'), 2000);
      } else if (error.response?.status === 400) {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.error || 'Invalid data. Please check your inputs.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.error || 'Error adding hotel. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear the form
  const handleClear = () => {
    setHotel({
      name: '',
      location: '',
      price: '',
      rating: '',
      description: '',
      images: ['']
    });
    setActiveImagePreview(0);
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ListyGo Admin</h1>
          <div className="flex items-center gap-4">
            <span>{localStorage.getItem('userName') || 'Admin'}</span>
            <button 
              className="px-3 py-1 bg-blue-700 hover:bg-blue-900 rounded"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userRole');
                navigate('/admin/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Hotels</h2>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-300"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </button>
          </div>
        </div>
        
        {/* Notification */}
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 mb-6 rounded-lg shadow ${
                message.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
                'bg-red-100 text-red-800 border-l-4 border-red-500'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Hotel</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiHome className="inline mr-2" /> Hotel Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={hotel.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hotel name"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiMapPin className="inline mr-2" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={hotel.location}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                    validationErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, Country"
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FiDollarSign className="inline mr-2" /> Price per Night
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={hotel.price}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                      validationErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                  />
                  {validationErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FiStar className="inline mr-2" /> Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    value={hotel.rating}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                      validationErrors.rating ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1-5"
                  />
                  {validationErrors.rating && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.rating}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiFileText className="inline mr-2" /> Description
                </label>
                <textarea
                  name="description"
                  value={hotel.description}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="5"
                  placeholder="Describe the hotel and its amenities..."
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>
            </div>
            
            {/* Right Column - Multiple Images and Preview */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-medium">
                    <FiImage className="inline mr-2" /> Hotel Images
                  </label>
                  <button 
                    type="button"
                    onClick={addImageField}
                    className="text-blue-600 flex items-center gap-1 text-sm hover:text-blue-800"
                  >
                    <FiPlus /> Add More Images
                  </button>
                </div>
                
                {hotel.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                        validationErrors.images ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={`Image URL ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Remove image"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                
                {validationErrors.images && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
                )}
              </div>
              
              <div>
                <p className="text-gray-700 font-medium mb-2">Image Preview</p>
                <div className="border border-gray-300 rounded-md h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {hotel.images[activeImagePreview] ? (
                    <img 
                      src={hotel.images[activeImagePreview]} 
                      alt={`Hotel preview ${activeImagePreview + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL';
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <FiImage size={48} className="mx-auto mb-2" />
                      <p>No image preview available</p>
                      <p className="text-sm">Enter a valid image URL to see preview</p>
                    </div>
                  )}
                </div>
                
                {/* Image thumbnail navigation - only show if there are multiple images */}
                {hotel.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                    {hotel.images.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setActiveImagePreview(index)}
                        className={`cursor-pointer border-2 w-16 h-16 flex-shrink-0 ${
                          activeImagePreview === index 
                            ? 'border-blue-500' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {img ? (
                          <img 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <FiImage />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 flex items-center gap-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  <FiX /> Clear Form
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 flex items-center gap-2 rounded-md shadow text-white transition ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Hotel
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Future implementation: Display existing hotels in a table/grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Existing Hotels</h3>
            <button className="text-blue-600 flex items-center gap-1">
              <FiPlus /> Add Filter
            </button>
          </div>
          
          <p className="text-gray-500 text-center py-8">
            Hotel listing functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHotels;