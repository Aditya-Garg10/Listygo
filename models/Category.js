const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  icon: {
    type: String,
    default: 'building' // Default icon name (can be used with font-awesome or other icon sets)
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name before saving
CategorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  next();
});

module.exports = mongoose.model('Category', CategorySchema);