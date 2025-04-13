const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price per night']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    required: [true, 'Please add a rating']
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
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  size: {
    type: Number,
    default: null
  },
  parking: {
    type: Boolean,
    default: false
  },
  maxGuests: {
    type: Number,
    default: 2
  },
  // Adding amenities field
  amenities: {
    type: [String],
    default: ['WiFi', 'Air Conditioning']
  },
  // Adding host information
  host: {
    name: {
      type: String,
      default: 'Host'
    },
    image: {
      type: String,
      default: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    isSuperhost: {
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
  }
});

module.exports = mongoose.model('Hotel', HotelSchema);