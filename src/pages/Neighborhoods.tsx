import React, { useState } from 'react';
import { MapPin, Users, GraduationCap, Car, TrendingUp } from 'lucide-react';
import { neighborhoodApi } from '../services/api';
import { NeighborhoodData } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Neighborhoods: React.FC = () => {
  const [formData, setFormData] = useState({
    neighborhood: '',
    city: ''
  });
  
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await neighborhoodApi.getData(formData.neighborhood, formData.city);
      console.log('🏘️ Neighborhoods Component - Raw response from API service:', response);
      console.log('🏘️ Neighborhoods Component - Type of response:', typeof response);
      console.log('🏘️ Neighborhoods Component - Keys in response:', Object.keys(response || {}));
      setNeighborhoodData(response || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load neighborhood data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num?: number) => num ? new Intl.NumberFormat('en-US').format(num) : '-';
  const formatCurrency = (amount?: number) => amount ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount) : '-';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Neighborhoods</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get comprehensive insights into neighborhood demographics, amenities, schools, and market trends.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood *
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder="e.g., SoMa, Downtown, Midtown"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, New York, Los Angeles"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              <span>{loading ? 'Loading...' : 'Explore Neighborhood'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner size="lg" text="Analyzing neighborhood data..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} />
      ) : neighborhoodData ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-2">
              {neighborhoodData.neighborhood || '-'}, {neighborhoodData.city || '-'}
            </h3>
            <p className="text-blue-100">Comprehensive Neighborhood Analysis</p>
          </div>

          {/* Demographics */}
          {neighborhoodData.demographics && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h4 className="text-2xl font-bold text-gray-900">Demographics</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(neighborhoodData.demographics.population)}
                  </div>
                  <div className="text-gray-700 font-medium">Population</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {neighborhoodData.demographics.median_age || '-'}
                  </div>
                  <div className="text-gray-700 font-medium">Median Age</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(neighborhoodData.demographics.median_income)}
                  </div>
                  <div className="text-gray-700 font-medium">Median Income</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl">
                  <div className="text-lg font-bold text-orange-600 mb-2">
                    {neighborhoodData.demographics.education_level || '-'}
                  </div>
                  <div className="text-gray-700 font-medium">Education Level</div>
                </div>
              </div>
            </div>
          )}

          {/* Optional: Render other sections similarly with safe access */}
          {/* Amenities, Schools, Transportation, Market Trends can follow the same pattern */}
        </div>
      ) : null}
    </div>
  );
};

export default Neighborhoods;
