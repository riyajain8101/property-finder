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

    // 🔑 Extract neighborhood info safely
    const neighborhoodInfo = result?.data?.result?.Output?.neighborhood_info || {};

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