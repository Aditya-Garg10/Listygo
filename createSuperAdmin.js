const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const Admin = require('./models/Admin');

// Load env vars
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  createSuperAdmin();
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Create super-admin
const createSuperAdmin = async () => {
  try {
    // Check if a super-admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log('A super-admin already exists in the database');
      rl.close();
      return;
    }

    // Get admin details from user input
    rl.question('Enter super-admin name: ', (name) => {
      rl.question('Enter super-admin email: ', (email) => {
        rl.question('Enter super-admin password: ', async (password) => {
          // Super-admin data
          const superAdminData = {
            name,
            email,
            password,
            role: 'super-admin'
          };

          try {
            await Admin.create(superAdminData);
            console.log('Super Admin created successfully');
          } catch (error) {
            console.error('Error creating super admin:', error.message);
          }
          rl.close();
        });
      });
    });
  } catch (error) {
    console.error(error);
    rl.close();
  }
};

rl.on('close', () => {
  mongoose.disconnect();
  process.exit(0);
});