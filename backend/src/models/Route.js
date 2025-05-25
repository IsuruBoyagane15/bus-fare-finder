const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const routeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  busTypes: [{
    type: String,
    enum: ['SUPER_LUXURY', 'LUXURY', 'SEMI_LUXURY', 'NORMAL']
  }],
  locations: {
    type: Map,
    of: [String],
    default: new Map()
  },
  fareMatrix: {
    type: Map,
    of: [Number],
    default: new Map()
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Helper function to calculate fare array size
routeSchema.statics.calculateFareArraySize = function(numStops) {
  return (numStops * (numStops - 1)) / 2;
};

// Helper function to get fare index
routeSchema.statics.getFareIndex = function(fromIndex, toIndex, totalStops) {
  if (fromIndex >= toIndex) return -1;
  let index = 0;
  for (let i = 1; i < toIndex; i++) {
    index += i;
  }
  return index + fromIndex;
};

module.exports = mongoose.model('Route', routeSchema); 