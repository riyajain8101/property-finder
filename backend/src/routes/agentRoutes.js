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

    // 🔑 Extract agent profiles with flexible structure handling
    let agents = [];
    
    if (result?.data) {
      if (result.data.rawText) {
        // Handle raw text response - SmythOS returned non-JSON
        console.log('SmythOS returned raw text:', result.data.rawText);
        try {
          const jsonMatch = result.data.rawText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            agents = extractAgents(parsed);
          }
        } catch (e) {
          console.log('Could not extract JSON from raw text');
        }
      } else {
        // Handle parsed JSON response
        agents = extractAgents(result.data);
      }
    }

    // Helper function to extract agents from various JSON structures
    function extractAgents(data) {
      // Try multiple possible paths for agent profiles
      return data?.Output?.agent_profiles ||
             data?.result?.Output?.agent_profiles ||
             data?.agent_profiles ||
             data?.agents ||
             data?.Output ||
             (Array.isArray(data) ? data : []);
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
