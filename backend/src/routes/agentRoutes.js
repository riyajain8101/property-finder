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
    let agents = [];
    
    if (result?.data?.rawText) {
      // Handle raw text response - SmythOS returned non-JSON
      console.log('SmythOS returned raw text:', result.data.rawText);
      // Try to extract JSON from the raw text if it contains JSON
      try {
        const jsonMatch = result.data.rawText.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          agents = parsed?.Output?.agent_profiles || [];
        }
      } catch (e) {
        console.log('Could not extract JSON from raw text');
      }
    } else if (result?.data?.Output?.agent_profiles) {
      // Handle direct JSON response structure
      agents = result.data.Output.agent_profiles;
    } else if (result?.data?.result?.Output?.agent_profiles) {
      // Handle nested result structure
      agents = result.data.result.Output.agent_profiles;
    }

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
