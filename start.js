/**
 * Server startup script
 * 
 * This script helps ensure the server starts correctly and provides helpful
 * debugging information if something goes wrong.
 */

console.log('🚀 Starting ListyGo Backend Server...');

try {
  // Check if .env file exists
  const fs = require('fs');
  if (!fs.existsSync('./.env')) {
    console.warn('⚠️  Warning: No .env file found. Using environment variables.');
  } else {
    console.log('✅ .env file found');
  }

  // Check MongoDB connection string
  require('dotenv').config();
  if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI environment variable is missing!');
    console.error('Please create a .env file with MONGO_URI=your_mongodb_connection_string');
    process.exit(1);
  }

  // Start the server
  console.log('📡 Starting API server...');
  require('./index.js');
} catch (error) {
  console.error('❌ Failed to start server:');
  console.error(error);
  process.exit(1);
}
