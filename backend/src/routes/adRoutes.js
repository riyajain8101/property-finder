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

    // 🔑 Extract ads safely
    const ads = result?.data?.result?.Output?.ads || [];

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
