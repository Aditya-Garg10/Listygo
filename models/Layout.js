const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
  large1: {
    type: String,
    default: ''
  },
  large2: {
    type: String,
    default: ''
  },
  small1: {
    type: String,
    default: ''
  },
  small2: {
    type: String,
    default: ''
  },
  small3: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Layout', LayoutSchema);
