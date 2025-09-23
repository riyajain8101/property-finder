import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, AlertCircle, X } from 'lucide-react';
import { getMockAds } from '../services/adService';
import { Ad } from '../types/Ad';

const Advertisement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const loadAds = () => {
      try {
        const fetchedAds = getMockAds();
        setAds(fetchedAds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load advertisement');
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ads.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 10000); // Rotate every 10 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [ads.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ads.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 10000); // Rotate every 10 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [ads.length]); // Re-run effect if ads.length changes

  const handleDismiss = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  if (loading || ads.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 mb-4" role="complementary">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading advertisement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-md p-6 border border-red-200 mb-4" role="complementary">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Advertisement Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  if (!currentAd) {
    return null;
  }

  if (!currentAd) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 mb-4 relative" role="complementary">
      <button
        onClick={handleDismiss}
        aria-label="Dismiss advertisement"
        className="absolute top-3 right-3 p-1 rounded-full bg-white/70 hover:bg-white transition-colors duration-200 text-gray-600 hover:text-gray-900 z-10"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {currentAd.title && (
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {currentAd.title}
              </h3>
            )}
            {currentAd.subtitle && (
              <p className="text-sm text-gray-600 font-medium">
                {currentAd.subtitle}
              </p>
            )}
          </div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Sponsored
          </div>
        </div>

        {/* Image */}
        {currentAd.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.imageAlt || 'Advertisement'}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        {currentAd.content && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentAd.content}
            </p>
          </div>
        )}

        {/* Call to Action */}
        {currentAd.cta && (
          <div className="flex justify-center">
            <a
              href={currentAd.cta.url}
              target={currentAd.cta.url.startsWith('http') ? '_blank' : '_self'}
              rel={currentAd.cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <span>{currentAd.cta.label}</span>
              {currentAd.cta.url.startsWith('http') && (
                <ExternalLink className="w-4 h-4" />
              )}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertisement;