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

    // 🔑 Extract listings with flexible structure handling
    let listings = [];
    
    if (result?.data) {
      if (result.data.rawText) {
        // Handle raw text response - SmythOS returned non-JSON
        console.log('SmythOS returned raw text:', result.data.rawText);
        try {
          const jsonMatch = result.data.rawText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            listings = extractListings(parsed);
          }
        } catch (e) {
          console.log('Could not extract JSON from raw text');
        }
      } else {
        // Handle parsed JSON response
        listings = extractListings(result.data);
      }
    }

    // Helper function to extract listings from various JSON structures
    function extractListings(data) {
      // Try multiple possible paths for listings
      const listings = data?.Output?.listings ||
             data?.result?.Output?.listings ||
             data?.listings ||
             data?.Output ||
             (Array.isArray(data) ? data : []);

      // Ensure listings is an array and normalize the data
      const normalizedListings = Array.isArray(listings) ? listings : [];
      
      // Process each listing to ensure proper data types
      return normalizedListings.map(listing => {
        // Normalize price to a number or null
        let normalizedPrice = null;
        if (listing.price !== null && listing.price !== undefined) {
          if (typeof listing.price === 'string') {
            // Remove currency symbols and commas, then parse
            const cleanPrice = listing.price.replace(/[$,]/g, '');
            const parsedPrice = parseFloat(cleanPrice);
            normalizedPrice = !isNaN(parsedPrice) ? parsedPrice : null;
          } else if (typeof listing.price === 'number') {
            normalizedPrice = listing.price;
          }
        }

        return {
          ...listing,
          price: normalizedPrice,
          // Ensure other fields are properly formatted
          bedrooms: listing.bedrooms || 0,
          bathrooms: listing.bathrooms || 0,
          features: Array.isArray(listing.features) ? listing.features : 
                   (listing.features ? listing.features.split(',').map(f => f.trim()) : [])
        };
      });
    }

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

    // 🔑 Extract details with flexible structure handling
    let details = {};
    
    if (result?.data) {
      if (result.data.rawText) {
        // Handle raw text response - SmythOS returned non-JSON
        console.log('SmythOS returned raw text:', result.data.rawText);
        try {
          const jsonMatch = result.data.rawText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            details = extractDetails(parsed);
          }
        } catch (e) {
          console.log('Could not extract JSON from raw text');
        }
      } else {
        // Handle parsed JSON response
        details = extractDetails(result.data);
      }
    }

    // Helper function to extract details from various JSON structures
    function extractDetails(data) {
      // Try multiple possible paths for property details
      return data?.Output ||
             data?.result?.Output ||
             data?.property_details ||
             data?.details ||
             data || {};
    }

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
