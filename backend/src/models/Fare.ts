import mongoose, { Schema, Document } from 'mongoose';
import { BusType } from './RouteConfiguration';

interface IFare extends Document {
  routeId: mongoose.Types.ObjectId;
  busType: BusType;
  fromStopId: mongoose.Types.ObjectId;
  toStopId: mongoose.Types.ObjectId;
  fare: number;
  currency: string;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FareSchema = new Schema({
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  busType: {
    type: String,
    enum: Object.values(BusType),
    required: true
  },
  fromStopId: {
    type: Schema.Types.ObjectId,
    ref: 'Stop',
    required: true
  },
  toStopId: {
    type: Schema.Types.ObjectId,
    ref: 'Stop',
    required: true
  },
  fare: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  effectiveFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  effectiveTo: {
    type: Date
  }
}, {
  timestamps: true
});

// Create compound indexes for efficient querying
FareSchema.index({ routeId: 1, busType: 1, effectiveFrom: -1 });
FareSchema.index({ fromStopId: 1, toStopId: 1 });

// Ensure unique fare for a route, bus type, and stop pair at any given time
FareSchema.index(
  { routeId: 1, busType: 1, fromStopId: 1, toStopId: 1, effectiveFrom: 1 },
  { unique: true }
);

export const Fare = mongoose.model<IFare>('Fare', FareSchema); 