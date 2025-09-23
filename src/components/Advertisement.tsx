import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { fetchAd } from '../services/adService';
import { Ad } from '../types/Ad';

const Advertisement: React.FC = () => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAd = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedAd = await fetchAd({ location: 'USA', count: 1 });
        setAd(fetchedAd);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load advertisement');
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading advertisement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Advertisement Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {ad.title && (
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {ad.title}
              </h3>
            )}
            {ad.subtitle && (
              <p className="text-sm text-gray-600 font-medium">
                {ad.subtitle}
              </p>
            )}
          </div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Featured
          </div>
        </div>

        {/* Image */}
        {ad.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={ad.imageUrl}
              alt={ad.imageAlt || 'Advertisement'}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        {ad.content && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {ad.content}
            </p>
          </div>
        )}

        {/* Call to Action */}
        {ad.cta && (
          <div className="flex justify-center">
            <a
              href={ad.cta.url}
              target={ad.cta.url.startsWith('http') ? '_blank' : '_self'}
              rel={ad.cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              <span>{ad.cta.label}</span>
              {ad.cta.url.startsWith('http') && (
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