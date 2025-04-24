const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
// Initialize Firebase if not already initialized
const initFirebase = () => {
  if (!admin.apps.length) {
    try {
      // Check if we can access the environment variable
      let serviceAccount;
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET ;
      
      // Try different approaches to get the service account
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          // Try to parse it as JSON directly
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          console.log("Successfully parsed FIREBASE_SERVICE_ACCOUNT_KEY from environment variable");
        } catch (parseError) {
          console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", parseError.message);
          
          // If that fails, maybe it's a file path
          if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) {
            const rawData = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            serviceAccount = JSON.parse(rawData);
            console.log("Loaded service account from file");
          }
        }
      }

      // If we still don't have service account credentials, check for a local file
      if (!serviceAccount) {
        const localPath = path.join(__dirname, '../firebase-credentials.json');
        if (fs.existsSync(localPath)) {
          const rawData = fs.readFileSync(localPath);
          serviceAccount = JSON.parse(rawData);
          console.log("Loaded service account from local file");
        } else {
          throw new Error("No valid Firebase service account credentials found");
        }
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucket
      });
      
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw new Error(`Firebase initialization failed: ${error.message}`);
    }
  }
  return admin;
};

module.exports = initFirebase();