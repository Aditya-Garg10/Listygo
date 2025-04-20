const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const adminRoutes = require('./routes/admin');
const listingsRoutes = require('./routes/listings');
const categoriesRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Set port from environment or default to 3000
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: "https://listygo-fe-two.vercel.app", // Replace with your frontend URL
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('ListyGo API - Welcome to our listing service');
});

// Mount routers
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});