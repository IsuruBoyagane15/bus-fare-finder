import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || 'bus_fares';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Construct the full MongoDB URI with the database name
const FULL_MONGODB_URI = `${MONGODB_URI.replace(/\/?$/, '/')}${DB_NAME}`;

// Connect to MongoDB and start server
mongoose
  .connect(FULL_MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB database: ${DB_NAME}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 