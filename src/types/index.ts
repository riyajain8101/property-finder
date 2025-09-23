// Property types
export interface Property {
  id: string;
  title: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  location: string;
  image?: string;
  description?: string;
}

export interface PropertyDetail extends Property {
  full_description: string;
  amenities: string[];
  neighborhood_info: string;
  agent_details: {
    name: string;
    phone: string;
    email: string;
    experience: string;
  };
}

// Agent types
export interface Agent {
  id?: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  specialties: string[];
  recent_sales: number;
  rating: number;
  location: string;
  profile_image?: string;
  title?: string;
  company?: string;
  years_experience?: number;
  languages?: string[];
  awards?: string[];
  website?: string;
  availability?: string;
  contact_preference?: string;
}

// Neighborhood types
export interface NeighborhoodData {
  neighborhood: string;
  city: string;
  demographics: {
    population: number;
    median_age: number;
    median_income: number;
    education_level: string;
  };
  amenities: string[];
  schools: Array<{
    name: string;
    type: string;
    rating: number;
  }>;
  transportation: {
    public_transit: string[];
    walkability_score: number;
    bike_score: number;
  };
  market_trends: {
    median_home_price: number;
    price_change_1yr: number;
    days_on_market: number;
  };
}

// Ad types
export interface PropertyAd {
  id?: string;
  title: string;
  content: string;
  ad_type: string;
  location: string;
  property_type: string;
  price_range: string;
  created_at: string;
  subtitle?: string;
  description?: string;
  company_name?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  phone?: string;
  email?: string;
  rating?: number;
  reviews_count?: number;
  service_area?: string;
  special_offer?: string;
  target_audience?: string;
  placement_priority?: string;
}

// Form types
export interface PropertySearchForm {
  location: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
  bathrooms: string;
  property_type: string;
  features: string;
  count: string;
}

export interface AgentSearchForm {
  location: string;
  count: string;
  specialties: string;
}

export interface AdGenerationForm {
  location: string;
  property_type: string;
  price_range: string;
  ad_type: string;
  count: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  details?: string;
}