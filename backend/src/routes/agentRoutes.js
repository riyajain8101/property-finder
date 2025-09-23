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
      const agents = data?.result?.Output?.agent_profiles ||
                    data?.Output?.agent_profiles ||
                    data?.agent_profiles ||
                    data?.agents ||
                    data?.Output ||
                    (Array.isArray(data) ? data : []);

      // Normalize agent data to match frontend expectations
      return Array.isArray(agents) ? agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        experience: agent.bio || `${agent.years_experience || 0} years of experience`,
        specialties: agent.specialties || [],
        recent_sales: agent.recent_sales?.count || 0,
        rating: 4.5, // Default rating since not provided by API
        location: agent.service_areas?.join(', ') || 'Redmond, WA',
        profile_image: agent.photo_url,
        title: agent.title,
        company: agent.company,
        years_experience: agent.years_experience,
        languages: Array.isArray(agent.languages) ? agent.languages : [],
        awards: Array.isArray(agent.awards) ? agent.awards : [],
        website: agent.website,
        availability: agent.availability,
        contact_preference: agent.contact_preference
      })) : [];
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
