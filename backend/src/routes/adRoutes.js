import express from 'express';
import { makeSmythosRequest } from '../utils/smythosApi.js';

const router = express.Router();

// Generate property ads
router.post('/generate', async (req, res, next) => {
  try {
    const { location, property_type, price_range, ad_type, count } = req.body;

    // Validate required fields
    if (!location || !property_type) {
      return res.status(400).json({
        success: false,
        message: 'Location and property type are required'
      });
    }

    const requestData = {
      location: location || '',
      property_type: property_type || '',
      price_range: price_range || '',
      ad_type: ad_type || 'general',
      count: count || '5'
    };

    const result = await makeSmythosRequest('/api/generate_ads', 'POST', requestData);

    // 🔑 Extract ads with flexible structure handling
    let ads = [];
    
    if (result?.data) {
      if (result.data.rawText) {
        // Handle raw text response - SmythOS returned non-JSON
        console.log('SmythOS returned raw text:', result.data.rawText);
        try {
          const jsonMatch = result.data.rawText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            ads = extractAds(parsed);
          }
        } catch (e) {
          console.log('Could not extract JSON from raw text');
        }
      } else {
        // Handle parsed JSON response
        ads = extractAds(result.data);
      }
    }

    // Helper function to extract ads from various JSON structures
    function extractAds(data) {
      // Try multiple possible paths for ads
      return data?.result?.Output?.advertisements ||
             data?.Output?.advertisements ||
             data?.Output?.ads ||
             data?.result?.Output?.ads ||
             data?.ads ||
             data?.advertisements ||
             data?.Output ||
             (Array.isArray(data) ? data : []);
    }

    // Debug logs
    console.log('SmythOS full response (ads):', JSON.stringify(result.data, null, 2));
    console.log('Extracted ads count:', ads.length);

    res.json({
      success: true,
      data: ads,
      message: 'Property ads generated successfully'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
