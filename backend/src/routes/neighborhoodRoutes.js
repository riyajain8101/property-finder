import express from 'express';
import { makeSmythosRequest } from '../utils/smythosApi.js';

const router = express.Router();

// Get neighborhood data
router.get('/data', async (req, res, next) => {
  try {
    const { neighborhood, city } = req.query;

    // Validate required fields
    if (!neighborhood || !city) {
      return res.status(400).json({
        success: false,
        message: 'Neighborhood and city are required'
      });
    }

    const params = {
      neighborhood: neighborhood || '',
      city: city || ''
    };

    const result = await makeSmythosRequest('/api/neighborhood_data', 'GET', null, params);

    // 🔑 Extract neighborhood info with flexible structure handling
    let neighborhoodInfo = {};
    
    if (result?.data) {
      if (result.data.rawText) {
        // Handle raw text response - SmythOS returned non-JSON
        console.log('SmythOS returned raw text:', result.data.rawText);
        try {
          const jsonMatch = result.data.rawText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            neighborhoodInfo = extractNeighborhoodInfo(parsed);
          }
        } catch (e) {
          console.log('Could not extract JSON from raw text');
        }
      } else {
        // Handle parsed JSON response
        neighborhoodInfo = extractNeighborhoodInfo(result.data);
      }
    }

    // Helper function to extract neighborhood info from various JSON structures
    function extractNeighborhoodInfo(data) {
      // Try multiple possible paths for neighborhood info
      return data?.Output?.neighborhood_info ||
             data?.result?.Output?.neighborhood_info ||
             data?.neighborhood_info ||
             data?.neighborhood ||
             data?.Output ||
             data || {};
    }

    // Debug logs
    console.log('SmythOS full response (neighborhood):', JSON.stringify(result.data, null, 2));
    console.log('Extracted neighborhood info keys:', Object.keys(neighborhoodInfo));

    res.json({
      success: true,
      data: neighborhoodInfo,
      message: 'Neighborhood data retrieved successfully'
    });

  } catch (error) {
    next(error);
  }
});

export default router;