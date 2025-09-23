const SMYTHOS_BASE_URL = 'https://cmfutewj7t8k62py5m7lqkqlm.agent.a.smyth.ai';

export const makeSmythosRequest = async (endpoint, method = 'GET', data = null, params = null) => {
  try {
    let url = `${SMYTHOS_BASE_URL}${endpoint}`;
    
    // Add query parameters for GET requests
    if (params && method === 'GET') {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain, application/json',
      },
    };

    // Add body for POST requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log(`Making ${method} request to: ${url}`);
    if (data) {
      console.log('Request body:', JSON.stringify(data, null, 2));
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SmythOS API Error (${response.status}): ${errorText}`);
    }

    // Get response as text first since SmythOS returns text/plain
    const responseText = await response.text();
    
    // Try to parse as JSON, but fall back to text if it fails
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, wrap the raw text in an object
      result = { rawText: responseText };
    }

    console.log('SmythOS response:', result);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('SmythOS API request failed:', error);
    
    // Handle different types of errors
    if (error.message.includes('fetch')) {
      throw new Error('Failed to connect to SmythOS API');
    }
    
    throw error;
  }
};