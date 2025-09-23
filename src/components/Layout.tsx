import React from 'react';
import React, { useState, useEffect } from 'react';
import { Home, Users, MapPin, Megaphone, Search } from 'lucide-react';
import { adApi } from '../services/api';
import { PropertyAd } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [ads, setAds] = useState<PropertyAd[]>([]);
  const [adLoading, setAdLoading] = useState(true);
  const [adError, setAdError] = useState<string | null>(null);

  const tabs = [
    { id: 'listings', label: 'Property Listings', icon: Home },
    { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin },
    { id: 'agents', label: 'Find Agents', icon: Users },
    { id: 'ads', label: 'Generate Ads', icon: Megaphone },
  ];

  // Fetch ads when component mounts
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setAdLoading(true);
        setAdError(null);
        
        // Fetch a general real estate ad
        const response = await adApi.generate({
          location: 'USA',
          property_type: 'house',
          price_range: '$300K - $800K',
          ad_type: 'general',
          count: '1'
        });
        
        setAds(response || []);
      } catch (err: any) {
        setAdError(err.message || 'Failed to load ads');
      } finally {
        setAdLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PropertyFinder</h1>
                <p className="text-sm text-gray-500">AI-Powered Real Estate Discovery</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real Estate Ad Section */}
        <div className="mb-8">
          {adLoading ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <LoadingSpinner size="sm" text="Loading featured property..." />
            </div>
          ) : adError ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <ErrorMessage message={adError} />
            </div>
          ) : ads.length > 0 ? (
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        Featured Property
                      </span>
                      <span className="text-blue-100 text-sm">
                        {ads[0].ad_type?.replace('_', ' ').toUpperCase() || 'GENERAL'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {ads[0].title || 'Premium Real Estate Opportunity'}
                    </h3>
                    <p className="text-blue-100 leading-relaxed mb-4 max-w-3xl">
                      {ads[0].description || ads[0].content || 'Discover your dream property today!'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      {ads[0].location && (
                        <div className="flex items-center space-x-1 text-blue-100">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{ads[0].location}</span>
                        </div>
                      )}
                      {ads[0].property_type && (
                        <div className="flex items-center space-x-1 text-blue-100">
                          <Home className="w-4 h-4" />
                          <span className="text-sm capitalize">{ads[0].property_type}</span>
                        </div>
                      )}
                      {ads[0].price_range && (
                        <div className="flex items-center space-x-1 text-blue-100">
                          <span className="text-sm font-medium">{ads[0].price_range}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-3">
                    {ads[0].cta_url && ads[0].cta_text ? (
                      <a
                        href={ads[0].cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                      >
                        {ads[0].cta_text}
                      </a>
                    ) : (
                      <button
                        onClick={() => onTabChange('listings')}
                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        View Properties
                      </button>
                    )}
                    
                    {ads[0].phone && (
                      <a
                        href={`tel:${ads[0].phone}`}
                        className="px-6 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-200 text-center text-sm"
                      >
                        📞 {ads[0].phone}
                      </a>
                    )}
                  </div>
                </div>
                
                {ads[0].special_offer && (
                  <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-300/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-200">🎉</span>
                      <span className="text-yellow-100 font-medium">{ads[0].special_offer}</span>
                    </div>
                  </div>
                )}
                
                {ads[0].company_name && (
                  <div className="mt-4 text-right">
                    <span className="text-blue-200 text-sm">
                      Presented by {ads[0].company_name}
                    </span>
                    {ads[0].rating && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className="text-yellow-300">⭐</span>
                        <span className="text-blue-200 text-sm">
                          {ads[0].rating}/5 ({ads[0].reviews_count || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 PropertyFinder. Created with ❤️ by Riya
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;