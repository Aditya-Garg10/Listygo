const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Firebase if not already initialized
const initFirebase = () => {
  if (!admin.apps.length) {
    try {
      let serviceAccount;
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
      
      // Create the service account file from environment variable if it doesn't exist
      const serviceAccountPath = path.join(__dirname, '../firebase-credentials.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        try {
          // Try to extract the JSON string and write it to a file
          const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
          fs.writeFileSync(serviceAccountPath, jsonStr);
          console.log("Created Firebase credentials file from environment variable");
        } catch (writeError) {
          console.error("Could not write Firebase credentials file:", writeError);
        }
      }
      
      // Now try to read from the file
      if (fs.existsSync(serviceAccountPath)) {
        try {
          const rawData = fs.readFileSync(serviceAccountPath);
          serviceAccount = JSON.parse(rawData);
          console.log("Loaded service account from file");
        } catch (fileError) {
          console.error("Error reading Firebase credentials file:", fileError);
        }
      }
      
      // If we still don't have credentials, try direct parsing as fallback
      if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Remove any extraneous whitespace and try parsing again
        const cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
          .replace(/\\n/g, "\\n")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .trim();
          
        try {
          serviceAccount = JSON.parse(cleanJson);
          console.log("Parsed service account directly from environment variable");
        } catch (parseError) {
          console.error("Final attempt to parse credentials failed:", parseError.message);
        }
      }

      if (!serviceAccount) {
        throw new Error("No valid Firebase service account credentials found");
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