import { Ad } from '../types/Ad';

const API_BASE_URL = 'http://localhost:3001/api';

interface FetchAdParams {
  location?: string;
  count?: number;
}

export const fetchAd = async (params: FetchAdParams = {}): Promise<Ad | null> => {
  try {
    const requestData = {
      location: params.location || 'USA',
      property_type: 'house',
      price_range: '$300K - $800K',
      ad_type: 'general',
      count: (params.count || 1).toString()
    };

    const response = await fetch(`${API_BASE_URL}/ads/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the first ad from the response
    const ads = result.data || [];
    if (!Array.isArray(ads) || ads.length === 0) {
      return null;
    }

    const rawAd = ads[0];
    
    // Normalize the ad data to match our Ad interface
    const normalizedAd: Ad = {
      id: rawAd.id || `ad-${Date.now()}`,
      title: rawAd.title || rawAd.subtitle || 'Featured Property',
      subtitle: rawAd.subtitle || rawAd.company_name || 'Real Estate Opportunity',
      content: rawAd.description || rawAd.content || 'Discover your dream property today.',
      imageUrl: rawAd.image_url || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      imageAlt: rawAd.title || 'Real Estate Property',
      cta: rawAd.cta_url && rawAd.cta_text ? {
        label: rawAd.cta_text,
        url: rawAd.cta_url
      } : {
        label: 'Learn More',
        url: '#'
      }
    };

    return normalizedAd;

  } catch (error) {
    console.error('Error fetching ad:', error);
    throw new Error('Failed to fetch advertisement');
  }
};