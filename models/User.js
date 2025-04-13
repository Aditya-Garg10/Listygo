//// filepath: c:\Users\Aditya Garg\OneDrive\Desktop\LISTIGO\Listygo-be\Listygo\models\User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PaymentMethodSchema = new mongoose.Schema({
  cardholderName: { type: String, required: true },
  last4: { type: String, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  cardType: { type: String, default: 'visa' }, // e.g. 'visa', 'mastercard', etc.
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String, // URL to the avatar image
    default: null
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  preferences: {
    email_marketing: { type: Boolean, default: false },
    booking_notifications: { type: Boolean, default: true },
    deal_alerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' }
  },
  paymentMethods: [PaymentMethodSchema], // <--- ADD THIS ARRAY OF PAYMENT METHODS
  bookings: [
    {
      id: { type: String },
      hotelName: { type: String },
      checkInDate: { type: Date },
      checkOutDate: { type: Date },
      status: { type: String },
      price: { type: Number },
      image: { type: String }
    }
  ],
  profileCompleted: { type: Number, default: 65 },
  favoriteHotels: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 0 },
  memberSince: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);