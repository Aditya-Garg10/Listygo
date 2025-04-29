const mongoose = require('mongoose');
const Listing = require('../models/Listing'); // adjust path if needed

// your MongoDB connection URI
const MONGO_URI = "mongodb+srv://cyberia2k24:74yhPfsUyyfDM8qM@cluster0.d4mpd1e.mongodb.net/listygo?retryWrites=true&w=majority&appName=Cluster0"

async function run() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✔️ Connected to MongoDB');

  const listings = await Listing.find({});
  console.log(`🔍 Found ${listings.length} listings`);

  for (const doc of listings) {
    let attrs = doc.attributes;
    // if it's an object, extract keys; if it's already a string, skip
    if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
      const keys = Object.keys(attrs).filter(k => k);
      const newAttrString = keys.join(', ');
      doc.attributes = newAttrString;
      await doc.save();
      console.log(`→ [${doc._id}] attributes updated to: "${newAttrString}"`);
    }
  }

  console.log('✅ All documents processed.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
}); 