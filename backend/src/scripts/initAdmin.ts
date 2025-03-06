import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function initializeAdmin() {
  try {
    const DB_NAME = process.env.DB_NAME || 'bus_fares';
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const FULL_MONGODB_URI = `${MONGODB_URI.replace(/\/?$/, '/')}${DB_NAME}`;

    await mongoose.connect(FULL_MONGODB_URI);
    console.log(`Connected to MongoDB database: ${DB_NAME}`);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!existingAdmin) {
      const admin = new User({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });

      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeAdmin(); 