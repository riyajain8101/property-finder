import { Ad } from '../types/Ad';

const mockAds: Ad[] = [
  {
    id: 'mock-ad-1',
    title: 'Modern City Apartment',
    subtitle: 'Prime Location, Stunning Views',
    content: 'Discover this spacious 2-bedroom, 2-bathroom apartment in the heart of the city. Featuring a modern kitchen, balcony, and access to premium amenities.',
    imageUrl: 'https://via.placeholder.com/400x200/FF5733/FFFFFF?text=Modern+Apartment',
    imageAlt: 'Modern City Apartment',
    cta: {
      label: 'View Details',
      url: '#apartment-details-1',
    },
  },
  {
    id: 'mock-ad-2',
    title: 'Luxury Oceanfront Villa',
    subtitle: 'Your Dream Coastal Retreat',
    content: 'Experience unparalleled luxury in this magnificent 5-bedroom villa with breathtaking ocean views, a private infinity pool, and direct beach access.',
    imageUrl: 'https://via.placeholder.com/400x200/33FF57/FFFFFF?text=Luxury+Villa',
    imageAlt: 'Luxury Oceanfront Villa',
    cta: {
      label: 'Explore Now',
      url: '#villa-details-2',
    },
  },
  {
    id: 'mock-ad-3',
    title: 'Cozy Family Townhouse',
    subtitle: 'Perfect for Growing Families',
    content: 'A charming 3-bedroom townhouse in a family-friendly neighborhood. Enjoy a private garden, community park, and excellent school districts.',
    imageUrl: 'https://via.placeholder.com/400x200/3357FF/FFFFFF?text=Cozy+Townhouse',
    imageAlt: 'Cozy Family Townhouse',
    cta: {
      label: 'Learn More',
      url: '#townhouse-details-3',
    },
  },
  {
    id: 'mock-ad-4',
    title: 'Investment Opportunity',
    subtitle: 'High-Yield Commercial Property',
    content: 'Secure your future with this prime commercial real estate. High foot traffic, excellent rental income potential, and strategic location.',
    imageUrl: 'https://via.placeholder.com/400x200/FFC300/000000?text=Commercial+Property',
    imageAlt: 'Commercial Property Investment',
    cta: {
      label: 'Invest Now',
      url: '#investment-details-4',
    },
  },
];

export const getMockAds = (): Ad[] => {
  return mockAds;
};