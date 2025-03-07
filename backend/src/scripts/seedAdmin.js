require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-fare-finder', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@busfinder.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      email: 'admin@busfinder.com',
      password: 'admin123' // This will be hashed automatically by the model
    });

    await admin.save();
    console.log('Default admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin(); 