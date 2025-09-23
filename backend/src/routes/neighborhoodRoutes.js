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
      const rawInfo = data?.Output?.neighborhood_info ||
                      data?.result?.Output?.neighborhood_info ||
                      data?.neighborhood_info ||
                      data?.neighborhood ||
                      data?.Output ||
                      data || {};

      // Map SmythOS response structure to frontend NeighborhoodData interface
      return {
        neighborhood: rawInfo.name || params.neighborhood || '',
        city: rawInfo.city || params.city || '',
        demographics: rawInfo.demographics ? {
          population: rawInfo.demographics.population || 0,
          median_age: rawInfo.demographics.median_age || 0,
          median_income: rawInfo.demographics.median_income || 0,
          education_level: rawInfo.demographics.education_level || ''
        } : undefined,
        amenities: rawInfo.amenities ? Object.values(rawInfo.amenities).filter(Boolean) : [],
        schools: rawInfo.schools || [],
        transportation: rawInfo.transportation ? {
          public_transit: rawInfo.transportation.public_transit ? [rawInfo.transportation.public_transit] : [],
          walkability_score: rawInfo.transportation.walkability_score || 0,
          bike_score: rawInfo.transportation.bike_score || 0
        } : undefined,
        market_trends: rawInfo.housing_market ? {
          median_home_price: rawInfo.housing_market.median_price || 0,
          price_change_1yr: rawInfo.housing_market.price_trend === 'rising' ? 5 : 0,
          days_on_market: rawInfo.housing_market.days_on_market || 0
        } : undefined,
        // Include additional useful data from SmythOS
        overview: rawInfo.overview,
        safety: rawInfo.safety,
        lifestyle: rawInfo.lifestyle,
        amenities_detailed: rawInfo.amenities,
        pros_cons: rawInfo.pros_cons,
        best_for: rawInfo.best_for,
        nearby_neighborhoods: rawInfo.nearby_neighborhoods,
        cost_of_living: rawInfo.cost_of_living,
        weather: rawInfo.weather,
        future_development: rawInfo.future_development
      };
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