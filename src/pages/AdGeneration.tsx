import React, { useState } from 'react';
import { Megaphone, Copy, Download } from 'lucide-react';
import { adApi } from '../services/api';
import { PropertyAd } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AdGeneration: React.FC = () => {
  const [formData, setFormData] = useState({
    location: '',
    property_type: '',
    price_range: '',
    ad_type: 'general',
    count: '5'
  });

  const [ads, setAds] = useState<PropertyAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adApi.generate(formData);
      console.log('🎯 AdGeneration Component - Raw response from API service:', response);
      console.log('🎯 AdGeneration Component - Type of response:', typeof response);
      console.log('🎯 AdGeneration Component - Is response an array?', Array.isArray(response));
      console.log('🎯 AdGeneration Component - Response length (if array):', Array.isArray(response) ? response.length : 'N/A');
      
      // Fix: response is already the data array from API service, not response.data
      setAds(response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate property ads');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadAd = (ad: PropertyAd) => {
    const element = document.createElement('a');
    const content = `${ad.title || 'Ad'}\n\n${ad.description || ad.content || ''}\n\nCompany: ${ad.company_name || 'N/A'}\nPhone: ${ad.phone || 'N/A'}\nEmail: ${ad.email || 'N/A'}${ad.special_offer ? `\n\nSpecial Offer: ${ad.special_offer}` : ''}`;
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${ad.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'ad'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Property Ads</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create compelling property advertisements tailored to your target audience and marketing channels.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <input
                type="text"
                name="price_range"
                value={formData.price_range}
                onChange={handleInputChange}
                placeholder="e.g., $300K - $800K"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
              <select
                name="ad_type"
                value={formData.ad_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="general">General</option>
                <option value="social_media">Social Media</option>
                <option value="print">Print</option>
                <option value="email">Email</option>
                <option value="luxury">Luxury</option>
                <option value="first_time_buyer">First-Time Buyer</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Ads</label>
              <select
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="3">3 Ads</option>
                <option value="5">5 Ads</option>
                <option value="10">10 Ads</option>
                <option value="15">15 Ads</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Megaphone className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Generate Ads'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner size="lg" text="Creating compelling property ads..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />
      ) : ads.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Generated {ads.length} Property Ads</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ads.map((ad, index) => (
              <div
                key={ad.id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{ad.title || '-'}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                          {ad.ad_type?.replace('_', ' ').toUpperCase() || '-'}
                        </span>
                        <span>{ad.location || '-'}</span>
                        <span>{ad.property_type || '-'}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                  </div>

                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                        {ad.description || ad.content || '-'}
                      </div>
                      {ad.special_offer && (
                        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm font-medium">
                          🎉 {ad.special_offer}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => copyToClipboard(ad.content ?? '', ad.id || `ad-${index}`)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        copiedId === (ad.id || `ad-${index}`)
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedId === (ad.id || `ad-${index}`) ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => downloadAd(ad)}
                      className="flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 border border-teal-200 transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>

                    {ad.company_name && (
                      <div className="flex-1 text-right text-xs text-gray-500">
                        By: {ad.company_name}
                      </div>
                    )}
                  </div>

                  {/* Additional Ad Details */}
                  {(ad.phone || ad.email || ad.cta_url) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {ad.phone && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <span>📞</span>
                            <span>{ad.phone}</span>
                          </div>
                        )}
                        {ad.email && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <span>✉️</span>
                            <span>{ad.email}</span>
                          </div>
                        )}
                        {ad.rating && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <span>⭐</span>
                            <span>{ad.rating}/5 ({ad.reviews_count} reviews)</span>
                          </div>
                        )}
                      </div>
                      {ad.cta_url && ad.cta_text && (
                        <div className="mt-3">
                          <a
                            href={ad.cta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 text-sm font-medium"
                          >
                            <span>{ad.cta_text}</span>
                            <span>→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdGeneration;
