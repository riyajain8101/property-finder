import express from 'express';
import { makeSmythosRequest } from '../utils/smythosApi.js';

const router = express.Router();

// Generate property listings
router.post('/generate-listings', async (req, res, next) => {
  try {
    const {
      location,
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      property_type,
      features,
      count
    } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    const requestData = {
      location: location || '',
      min_price: min_price || '',
      max_price: max_price || '',
      bedrooms: bedrooms || '',
      bathrooms: bathrooms || '',
      property_type: property_type || '',
      features: features || '',
      count: count || '10'
    };

    const result = await makeSmythosRequest('/api/generate_listings', 'POST', requestData);

    // 🔑 Extract listings safely
    const listings = result?.data?.result?.Output?.listings || [];

    // Debug logs
    console.log('SmythOS full response:', JSON.stringify(result.data, null, 2));
    console.log('Extracted listings count:', listings.length);

    res.json({
      success: true,
      data: listings,
      message: 'Property listings generated successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Get property details
router.post('/details', async (req, res, next) => {
  try {
    const { property_id, property_type, location } = req.body;

    if (!property_id || !property_type || !location) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, property type, and location are required'
      });
    }

    const requestData = {
      property_id: property_id || '',
      property_type: property_type || '',
      location: location || ''
    };

    const result = await makeSmythosRequest('/api/property_detail', 'POST', requestData);

    // 🔑 Extract details safely
    const details = result?.data?.result?.Output || {};

    // Debug logs
    console.log('SmythOS full response (details):', JSON.stringify(result.data, null, 2));
    console.log('Extracted property details keys:', Object.keys(details));

    res.json({
      success: true,
      data: details,
      message: 'Property details retrieved successfully'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
