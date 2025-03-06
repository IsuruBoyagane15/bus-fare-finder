import mongoose, { Schema, Document } from 'mongoose';

export enum BusType {
  LUXURY = 'Luxury',
  SEMI_LUXURY = 'Semi-Luxury',
  EXPRESSWAY = 'Expressway',
  AC = 'AC'
}

interface IRouteConfiguration extends Document {
  routeId: mongoose.Types.ObjectId;
  busType: BusType;
  stopSequence: {
    stopId: mongoose.Types.ObjectId;
    sequenceNumber: number;
    estimatedDuration?: number; // in minutes
  }[];
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RouteConfigurationSchema = new Schema({
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
  stopSequence: [{
    stopId: {
      type: Schema.Types.ObjectId,
      ref: 'Stop',
      required: true
    },
    sequenceNumber: {
      type: Number,
      required: true,
      min: 1
    },
    estimatedDuration: {
      type: Number,
      min: 0
    }
  }],
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

// Create compound indexes
RouteConfigurationSchema.index({ routeId: 1, busType: 1, effectiveFrom: -1 });
RouteConfigurationSchema.index({ 'stopSequence.stopId': 1 });

// Ensure unique route configuration for a bus type at any given time
RouteConfigurationSchema.index(
  { routeId: 1, busType: 1, effectiveFrom: 1 },
  { unique: true }
);

export const RouteConfiguration = mongoose.model<IRouteConfiguration>('RouteConfiguration', RouteConfigurationSchema); 