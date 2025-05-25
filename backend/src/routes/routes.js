const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const auth = require('../middleware/auth');

// Get optimized routes list for dropdown
router.get('/list', async (req, res) => {
  try {
    const routes = await Route.find({}, '_id number name');
    res.json({ routes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get cities for a specific route
router.get('/:id/cities', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Get unique cities across all bus types
    const cities = new Set();
    route.locations.forEach((locationArray) => {
      locationArray.forEach(city => cities.add(city));
    });
    
    res.json({ cities: Array.from(cities) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validation middleware for search-fare
const validateSearchFareRequest = (req, res, next) => {
  const { routeId, fromCity, toCity, busTypes } = req.body;

  const errors = [];

  // Required field validation
  if (!routeId) errors.push('routeId is required');
  if (!fromCity) errors.push('fromCity is required');
  if (!toCity) errors.push('toCity is required');

  // Type validation
  if (routeId && typeof routeId !== 'string') errors.push('routeId must be a string');
  if (fromCity && typeof fromCity !== 'string') errors.push('fromCity must be a string');
  if (toCity && typeof toCity !== 'string') errors.push('toCity must be a string');
  
  // Bus types validation if provided
  if (busTypes !== undefined) {
    if (!Array.isArray(busTypes)) {
      errors.push('busTypes must be an array');
    } else {
      if (busTypes.some(type => typeof type !== 'string')) {
        errors.push('all busTypes must be strings');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      type: 'ValidationError',
      errors: errors
    });
  }

  next();
};

// Search fare
router.post('/search-fare', validateSearchFareRequest, async (req, res) => {
  try {
    const { routeId, fromCity, toCity, busTypes } = req.body;
    
    // 1. Route validation
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'Route not found',
        details: { routeId }
      });
    }

    // 2. Bus type validation - only check for completely invalid types
    const requestedBusTypes = busTypes && Array.isArray(busTypes) && busTypes.length > 0 
      ? busTypes 
      : route.busTypes;

    // Define valid bus types (this should ideally come from a constant or enum)
    const validBusTypes = ['SUPER_LUXURY', 'LUXURY', 'SEMI_LUXURY', 'NORMAL'];
    
    // Check for completely invalid bus types
    const invalidBusTypes = requestedBusTypes.filter(type => !validBusTypes.includes(type));
    if (invalidBusTypes.length > 0) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Invalid bus types provided',
        details: {
          invalidTypes: invalidBusTypes,
          validBusTypes: validBusTypes
        }
      });
    }

    // 3. City validation - check if cities exist in any bus type route
    const allLocations = Array.from(route.locations.values()).flat();
    if (!allLocations.includes(fromCity) || !allLocations.includes(toCity)) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'One or both cities not found in route',
        details: {
          fromCity: allLocations.includes(fromCity) ? 'valid' : 'invalid',
          toCity: allLocations.includes(toCity) ? 'valid' : 'invalid',
          availableCities: [...new Set(allLocations)]
        }
      });
    }

    const results = [];

    for (const busType of requestedBusTypes) {
      try {
        const locations = route.locations.get(busType);
        if (!locations) {
          results.push({
            busType,
            fare: null
          });
          continue;
        }
        
        const fromIndex = locations.indexOf(fromCity);
        const toIndex = locations.indexOf(toCity);
        
        if (fromIndex === -1 || toIndex === -1) {
          results.push({
            busType,
            fare: null
          });
          continue;
        }
        
        const fareIndex = Route.getFareIndex(
          Math.min(fromIndex, toIndex),
          Math.max(fromIndex, toIndex),
          locations.length
        );
        
        const fares = route.fareMatrix.get(busType);
        
        if (!fares || fareIndex === -1) {
          results.push({
            busType,
            fare: null
          });
          continue;
        }

        // Calculate distance
        const distance = Math.abs(toIndex - fromIndex);
        
        results.push({
          busType,
          fare: fares[fareIndex]
        });
      } catch (err) {
        // Add null for any error cases
        results.push({
          busType,
          fare: null
        });
        console.error(`Error processing ${busType}:`, err);
      }
    }
    
    // Convert results array to simple object with busType as key and fare as value
    const fareResults = results.reduce((acc, { busType, fare }) => {
      acc[busType] = fare;
      return acc;
    }, {});

    res.json({
      status: 'success',
      route: {
        id: route._id,
        number: route.number,
        name: route.name
      },
      fromCity,
      toCity,
      results: fareResults
    });
    
  } catch (err) {
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one route
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (route) {
      res.json(route);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create route - protected
router.post('/', auth, async (req, res) => {
  const route = new Route({
    number: req.body.number,
    name: req.body.name,
    busTypes: req.body.busTypes,
    locations: new Map(Object.entries(req.body.locations || {})),
    fareMatrix: new Map()
  });

  // Initialize fare arrays for each bus type
  if (req.body.fareMatrix) {
    for (const [busType, fares] of Object.entries(req.body.fareMatrix)) {
      if (Array.isArray(fares)) {
        route.fareMatrix.set(busType, fares);
      }
    }
  }

  try {
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update route - protected
router.patch('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (req.body.number) route.number = req.body.number;
    if (req.body.name) route.name = req.body.name;
    if (req.body.busTypes) route.busTypes = req.body.busTypes;
    
    if (req.body.locations) {
      route.locations = new Map(Object.entries(req.body.locations));
      
      // When locations change, we need to resize the fare arrays
      for (const [busType, locations] of route.locations.entries()) {
        if (route.busTypes.includes(busType)) {
          const newSize = Route.calculateFareArraySize(locations.length);
          const currentFares = route.fareMatrix.get(busType) || [];
          const newFares = new Array(newSize).fill(0);
          
          // Copy existing fares where possible
          for (let i = 0; i < Math.min(currentFares.length, newSize); i++) {
            newFares[i] = currentFares[i];
          }
          
          route.fareMatrix.set(busType, newFares);
        }
      }
    }

    if (req.body.fareMatrix) {
      for (const [busType, fares] of Object.entries(req.body.fareMatrix)) {
        if (Array.isArray(fares) && route.busTypes.includes(busType)) {
          const locations = route.locations.get(busType) || [];
          const expectedSize = Route.calculateFareArraySize(locations.length);
          
          // Ensure the fare array is the correct size
          if (fares.length === expectedSize) {
            route.fareMatrix.set(busType, fares);
          } else {
            return res.status(400).json({ 
              message: `Invalid fare array size for ${busType}. Expected ${expectedSize}, got ${fares.length}` 
            });
          }
        }
      }
    }

    route.lastUpdated = new Date();
    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete route
router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    await route.deleteOne();
    res.json({ message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 