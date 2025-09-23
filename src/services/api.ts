const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || 'API request failed');
  }
  return response.json();
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error - please check your connection');
  }
};

// Property API calls
export const propertyApi = {
  generateListings: async (data: any) => {
    const response = await apiRequest('/properties/generate-listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('🔍 Frontend API Service - Full response from backend:', response);
    console.log('🔍 Frontend API Service - response.data:', response.data);
    console.log('🔍 Frontend API Service - Type of response.data:', typeof response.data);
    console.log('🔍 Frontend API Service - Is response.data an array?', Array.isArray(response.data));
    return response.data; // return inner data
  },

  getDetails: async (data: { property_id: string; property_type: string; location: string }) => {
    const response = await apiRequest('/properties/details', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

// Agent API calls
export const agentApi = {
  getProfiles: async (data: any) => {
    const response = await apiRequest('/agents/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('🔍 Frontend API Service (Agents) - Full response from backend:', response);
    console.log('🔍 Frontend API Service (Agents) - response.data:', response.data);
    console.log('🔍 Frontend API Service (Agents) - Type of response.data:', typeof response.data);
    console.log('🔍 Frontend API Service (Agents) - Is response.data an array?', Array.isArray(response.data));
    return response.data; // return agent_profiles array
  },
};

// Neighborhood API calls
export const neighborhoodApi = {
  getData: async (neighborhood: string, city: string) => {
    const params = new URLSearchParams({ neighborhood, city });
    const response = await apiRequest(`/neighborhoods/data?${params}`);
    console.log('🔍 Frontend API Service (Neighborhoods) - Full response from backend:', response);
    console.log('🔍 Frontend API Service (Neighborhoods) - response.data:', response.data);
    console.log('🔍 Frontend API Service (Neighborhoods) - Type of response.data:', typeof response.data);
    console.log('🔍 Frontend API Service (Neighborhoods) - Keys in response.data:', Object.keys(response.data || {}));
    return response.data; // return neighborhood info
  },
};

// Ad API calls
export const adApi = {
  generate: async (data: any) => {
    const response = await apiRequest('/ads/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('🎯 Frontend API Service (Ads) - Full response from backend:', response);
    console.log('🎯 Frontend API Service (Ads) - response.data:', response.data);
    console.log('🎯 Frontend API Service (Ads) - Type of response.data:', typeof response.data);
    console.log('🎯 Frontend API Service (Ads) - Is response.data an array?', Array.isArray(response.data));
    console.log('🎯 Frontend API Service (Ads) - Response.data length (if array):', Array.isArray(response.data) ? response.data.length : 'N/A');
    return response.data; // return generated ad data
  },
};

export { ApiError };
