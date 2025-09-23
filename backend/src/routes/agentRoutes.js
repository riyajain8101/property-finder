import express from 'express';
import { makeSmythosRequest } from '../utils/smythosApi.js';

const router = express.Router();

// Get agent profiles
router.post('/profiles', async (req, res, next) => {
  try {
    const { location, count, specialties } = req.body;

    // Validate required fields
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    const requestData = {
      location: location || '',
      count: count || '10',
      specialties: specialties || ''
    };

    const result = await makeSmythosRequest('/api/agent_profiles', 'POST', requestData);

    // 🔑 Extract agent profiles safely
    const agents = result?.data?.result?.Output?.agent_profiles || [];

    // Debug logs
    console.log('SmythOS full response (agents):', JSON.stringify(result.data, null, 2));
    console.log('Extracted agents count:', agents.length);

    res.json({
      success: true,
      data: agents,
      message: 'Agent profiles retrieved successfully'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
