const mongoose = require('mongoose');
const Listing = require('../models/Listing');

// Update this with your actual MongoDB URI
const MONGO_URI = "mongodb+srv://cyberia2k24:74yhPfsUyyfDM8qM@cluster0.d4mpd1e.mongodb.net/listygo?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings`);

    for (const listing of listings) {
      console.log(`Processing listing: ${listing._id}`);
      console.log(`  Current attributes: ${JSON.stringify(listing.attributes)}`);

      let attributes = listing.attributes;
      let extractedKeys = [];

      // CASE 1: If it's an object with numeric keys (character-by-character)
      if (attributes && typeof attributes === 'object' && !Array.isArray(attributes)) {
        const keys = Object.keys(attributes);
        // Check if keys are all numeric and sequential (0, 1, 2, etc.)
        const isCharByChar = keys.length > 0 && keys.every(
          (k, i) => !isNaN(parseInt(k)) && parseInt(k) === i
        );

        if (isCharByChar) {
          // Reconstruct the original string
          const originalString = keys.map(k => attributes[k]).join('');
          console.log(`  Reconstructed string: ${originalString}`);
          
          try {
            // Try to parse as JSON
            const parsedObj = JSON.parse(originalString);
            console.log(`  Parsed JSON: ${JSON.stringify(parsedObj)}`);
            
            if (typeof parsedObj === 'object') {
              extractedKeys = Object.keys(parsedObj);
            }
          } catch (e) {
            // If it's not valid JSON, just use the original string
            extractedKeys = [originalString.replace(/[{}"\[\]]/g, '')];
          }
        } else {
          // Normal object case
          extractedKeys = keys;
        }
      }
      // CASE 2: If it's already a string but looks like JSON
      else if (typeof attributes === 'string' && 
              (attributes.startsWith('{') || attributes.startsWith('['))) {
        try {
          const parsedObj = JSON.parse(attributes);
          if (typeof parsedObj === 'object') {
            extractedKeys = Object.keys(parsedObj);
          }
        } catch {
          // Not valid JSON, use as is
          extractedKeys = [attributes.replace(/[{}"\[\]]/g, '')];
        }
      }
      // CASE 3: Simple string
      else if (typeof attributes === 'string') {
        extractedKeys = [attributes];
      }

      // Join keys with commas
      const newAttributes = extractedKeys.join(', ');
      
      // Update the document
      listing.attributes = newAttributes;
      await listing.save();
      
      console.log(`  ✓ Updated to: "${newAttributes}"\n`);
    }

    console.log('✅ All documents processed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📌 Disconnected from MongoDB');
  }
}

run();