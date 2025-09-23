 import React, { useState } from 'react';
import { Users, Star, Award, Phone, Mail, MapPin } from 'lucide-react';
import { agentApi } from '../services/api';
import { Agent } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AgentProfiles: React.FC = () => {
  const [formData, setFormData] = useState({
    location: '',
    count: '10',
    specialties: ''
  });
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await agentApi.getProfiles(formData);
      console.log('👥 AgentProfiles Component - Raw response from API service:', response);
      console.log('👥 AgentProfiles Component - Type of response:', typeof response);
      console.log('👥 AgentProfiles Component - Is response an array?', Array.isArray(response));
      console.log('👥 AgentProfiles Component - Response length (if array):', Array.isArray(response) ? response.length : 'N/A');
      setAgents(response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load agent profiles');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating?: number) => {
    const safeRating = rating ? Math.floor(rating) : 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < safeRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Real Estate Agents</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with experienced real estate professionals who specialize in your area and property type.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Number of Agents
              </label>
              <select
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="5">5 Agents</option>
                <option value="10">10 Agents</option>
                <option value="20">20 Agents</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <input
                type="text"
                name="specialties"
                value={formData.specialties}
                onChange={handleInputChange}
                placeholder="e.g., luxury homes, first-time buyers"
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
              <Users className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'Find Agents'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner size="lg" text="Finding qualified agents..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} />
      ) : agents.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Found {agents.length} Qualified Agents
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id || `agent-${Math.random()}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="p-6">
                  {/* Agent Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    {agent.profile_image ? (
                      <img
                        src={agent.profile_image}
                        alt={agent.name || 'Agent'}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ display: agent.profile_image ? 'none' : 'flex' }}
                    >
                      {agent.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{agent.name || '-'}</h4>
                      {agent.title && agent.company && (
                        <p className="text-sm text-gray-600 mb-1">{agent.title} at {agent.company}</p>
                      )}
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(agent.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {agent.rating ?? '-'} / 5
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{agent.location || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {agent.years_experience ? `${agent.years_experience} Years Experience` : 'Experience'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                      {agent.experience || '-'}
                    </p>
                  </div>

                  {/* Languages */}
                  {agent.languages && agent.languages.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Languages</div>
                      <div className="flex flex-wrap gap-2">
                        {agent.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {agent.specialties && agent.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                        {agent.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{agent.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recent Sales */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <div className="text-2xl font-bold text-green-600">
                          {agent.recent_sales ?? '-'}
                        </div>
                        <div className="text-sm text-gray-700">Recent Sales</div>
                      </div>
                      {agent.availability && (
                        <div className="text-xs text-gray-600 text-center mt-2 border-t border-green-200 pt-2">
                          📞 {agent.availability}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Awards */}
                  {agent.awards && agent.awards.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Awards & Recognition</div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        {agent.awards.map((award, index) => (
                          <div key={index} className="text-sm text-yellow-800 flex items-center space-x-2">
                            <span>🏆</span>
                            <span>{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{agent.phone}</span>
                      </a>
                    )}
                    
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-200 group"
                      >
                        <Mail className="w-4 h-4 text-teal-600" />
                        <span className="text-teal-800 font-medium">{agent.email}</span>
                      </a>
                    )}
                    
                    {agent.website && (
                      <a
                        href={agent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 group"
                      >
                        <span className="text-purple-600">🌐</span>
                        <span className="text-purple-800 font-medium">Visit Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AgentProfiles;