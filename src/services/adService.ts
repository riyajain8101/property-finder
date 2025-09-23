    const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Dream Apartment in Downtown',
    subtitle: '2 bed · 2 bath · 1,200 sqft',
    content: 'Live in the heart of the city with easy access to shops and transit. This modern apartment features updated appliances and stunning city views.',
    imageUrl: 'https://via.placeholder.com/600x300/FF5733/FFFFFF?text=Downtown+Apartment',
    imageAlt: 'Downtown Apartment',
    cta: {
      label: 'View Details',
      url: '#downtown-apartment'
    }
  },
  {
    id: '2',
    title: 'Luxury Oceanfront Villa',
    subtitle: '4 bed · 3 bath · 2,800 sqft',
    content: 'Wake up to breathtaking ocean views every day. This stunning villa offers private beach access and world-class amenities.',
    imageUrl: 'https://via.placeholder.com/600x300/33FF57/FFFFFF?text=Oceanfront+Villa',
    imageAlt: 'Oceanfront Villa',
    cta: {
      label: 'Schedule Tour',
      url: '#oceanfront-villa'
    }
  },
  {
    id: '3',
    title: 'Cozy Family Home',
    subtitle: '3 bed · 2 bath · 1,800 sqft',
    content: 'Perfect for growing families! This charming home features a large backyard, updated kitchen, and is located in top-rated school district.',
    imageUrl: 'https://via.placeholder.com/600x300/3357FF/FFFFFF?text=Family+Home',
    imageAlt: 'Family Home',
    cta: {
      label: 'Learn More',
      url: '#family-home'
    }
  },
  {
    id: '4',
    title: 'Modern Condo Complex',
    subtitle: '1 bed · 1 bath · 850 sqft',
    content: 'Contemporary living at its finest. Enjoy resort-style amenities including pool, fitness center, and rooftop terrace with panoramic views.',
    imageUrl: 'https://via.placeholder.com/600x300/FF33F5/FFFFFF?text=Modern+Condo',
    imageAlt: 'Modern Condo',
    cta: {
      label: 'Explore Now',
      url: '#modern-condo'
    }
  }
];
export const getMockAds = (): Ad[] => {
  return mockAds;
};