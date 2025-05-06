import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Bed, Bath, Square, DollarSign, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { cn } from '../lib/utils';

type Property = Database['public']['Tables']['properties']['Row'];

type Filters = {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  isFurnished: boolean | null;
  minSquareFeet: number | null;
  propertyType: 'studio' | 'apartment' | null;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 10000],
    bedrooms: null,
    bathrooms: null,
    isFurnished: null,
    minSquareFeet: null,
    propertyType: null,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  async function fetchProperties() {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);

      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }
      if (filters.isFurnished !== null) {
        query = query.eq('is_furnished', filters.isFurnished);
      }
      if (filters.minSquareFeet) {
        query = query.gte('square_feet', filters.minSquareFeet);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Apply search filter client-side
      let filteredData = data || [];
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredData = filteredData.filter(property => 
          property.title.toLowerCase().includes(search) ||
          property.description.toLowerCase().includes(search) ||
          property.address.toLowerCase().includes(search)
        );
      }
      
      setProperties(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      bedrooms: null,
      bathrooms: null,
      isFurnished: null,
      minSquareFeet: null,
      propertyType: null,
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
          <p className="mt-2 text-gray-600">Find your perfect home near Virginia Tech Innovation Campus</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value), prev.priceRange[1]] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.propertyType || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  propertyType: e.target.value ? e.target.value as 'studio' | 'apartment' : null,
                  // Reset bedrooms filter if studio is selected
                  bedrooms: e.target.value === 'studio' ? null : prev.bedrooms
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>

            {filters.propertyType !== 'studio' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  value={filters.bedrooms || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+ beds</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}+ baths</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnished</label>
              <select
                value={filters.isFurnished === null ? '' : filters.isFurnished.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isFurnished: e.target.value === '' ? null : e.target.value === 'true'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Square Feet</label>
              <input
                type="number"
                value={filters.minSquareFeet || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minSquareFeet: e.target.value ? parseInt(e.target.value) : null
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Min sqft"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={property.images?.[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="flex items-center text-primary font-semibold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {property.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h2>
                  <span className="inline-block px-2 py-1 text-sm rounded-full bg-gray-200 text-gray-700">
                    {property.property_type === 'studio' ? 'Studio' : `${property.bedrooms} Bedroom`}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {property.property_type === 'apartment' && (
                  <div className="flex items-center text-gray-600">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.square_feet} sqft</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities?.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
                {(property.amenities?.length || 0) > 3 && (
                  <span className="text-gray-500 text-sm">
                    +{(property.amenities?.length || 0) - 3} more
                  </span>
                )}
              </div>

              <Link
                to={`/properties/${property.id}`}
                className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary-hover transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
}