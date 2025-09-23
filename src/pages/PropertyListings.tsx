import React, { useState } from 'react';
import { Search, Home, Bed, Bath, MapPin, DollarSign, Eye } from 'lucide-react';
import { propertyApi } from '../services/api';
import { Property, PropertyDetail } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PropertyListings: React.FC = () => {
  const [formData, setFormData] = useState({
    location: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    property_type: '',
    features: '',
    count: '10'
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      const response = await propertyApi.generateListings(formData);
      console.log('🏠 PropertyListings Component - Raw response from API service:', response);
      console.log('🏠 PropertyListings Component - Type of response:', typeof response);
      console.log('🏠 PropertyListings Component - Is response an array?', Array.isArray(response));
      console.log('🏠 PropertyListings Component - Response length (if array):', Array.isArray(response) ? response.length : 'N/A');
      
      // Set properties - response should already be the data array from API service
      setProperties(response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate property listings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (property: Property) => {
    setDetailsLoading(true);
    setSelectedProperty(null);
    setShowModal(true);

    try {
      const response = await propertyApi.getDetails({
        property_id: property.id,
        property_type: property.property_type,
        location: property.location
      });
      console.log('Property details response:', response.data);
      setSelectedProperty(response.data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load property details');
      setShowModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    return price ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price) : '-';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Property</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Use our AI-powered search to discover properties that match your exact needs and preferences.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Results
              </label>
              <select
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="5">5 Properties</option>
                <option value="10">10 Properties</option>
                <option value="20">20 Properties</option>
                <option value="50">50 Properties</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="text"
                name="min_price"
                value={formData.min_price}
                onChange={handleInputChange}
                placeholder="e.g., $300,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="text"
                name="max_price"
                value={formData.max_price}
                onChange={handleInputChange}
                placeholder="e.g., $800,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features & Amenities
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., pool, garage, modern kitchen, garden"
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
              <Search className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'Find Properties'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner size="lg" text="Generating property listings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} />
      ) : properties.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Found {properties.length} Properties
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Property Image */}
                <div className="h-48 relative overflow-hidden">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title || 'Property Image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = 'h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 relative';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400"></div>
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg truncate">{property.title || 'Property'}</h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location || 'Location not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      <span>
                        {property.price !== null && property.price !== undefined 
                          ? formatPrice(property.price)
                          : 'Price on request'
                        }
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {property.property_type || 'Property'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms || 0} beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms || 0} baths</span>
                    </div>
                  </div>

                  {property.features && property.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{property.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewDetails(property)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyListings; 