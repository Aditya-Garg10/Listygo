const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 4
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image URL'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one image URL is required'
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Common attributes across most listing types
  amenities: {
    type: [String],
    default: []
  },
  
  // Host/Owner information
  owner: {
    name: {
      type: String,
      default: 'Owner'
    },
    image: {
      type: String,
      default: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    responseRate: {
      type: Number,
      default: 95
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  
  // Category-specific attributes (using a flexible schema approach)
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Dynamic features based on category
  features: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  
  // Business hours
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  
  // Additional fields
  website: String,
  contactEmail: String,
  contactPhone: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String]
});

module.exports = mongoose.model('Listing', ListingSchema);