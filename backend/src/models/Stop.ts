import mongoose, { Schema, Document } from 'mongoose';

interface IStop extends Document {
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a compound index for coordinates
StopSchema.index({ coordinates: '2dsphere' });

export const Stop = mongoose.model<IStop>('Stop', StopSchema); 