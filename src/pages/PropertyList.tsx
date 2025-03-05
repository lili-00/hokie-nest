import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Property } from '../types/supabase';
import { Bed, Bath, Square, DollarSign, Search, MapPin, Calendar, Sofa } from 'lucide-react';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  
  // Filter states
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [leaseDuration, setLeaseDuration] = useState<string>('');
  const [isFurnished, setIsFurnished] = useState<string>('');
  
  // Unique values for filters
  const [locations, setLocations] = useState<string[]>([]);
  const [leaseDurations, setLeaseDurations] = useState<number[]>([]);

  // Add a new state for location search
  const [locationSearch, setLocationSearch] = useState<string>('');

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data || []);
        setFilteredProperties(data || []);
        
        // Extract unique values for filters
        const uniqueLocations = [...new Set(data?.map(p => p.location) || [])];
        const uniqueLeaseDurations = [...new Set(data?.map(p => p.lease_duration) || [])];
        
        setLocations(uniqueLocations);
        setLeaseDurations(uniqueLeaseDurations);
      }
      setLoading(false);
    }

    fetchProperties();
  }, []);

  const applyFilters = () => {
    let filtered = [...properties];
    
    if (minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(maxPrice));
    }
    
    if (location) {
      filtered = filtered.filter(property => property.location === location);
    }
    
    // Add location search filter
    if (locationSearch) {
      filtered = filtered.filter(property => 
        (property.location?.toLowerCase().includes(locationSearch.toLowerCase()) || 
         property.address?.toLowerCase().includes(locationSearch.toLowerCase()))
      );
    }
    
    if (leaseDuration) {
      filtered = filtered.filter(property => property.lease_duration === parseInt(leaseDuration));
    }
    
    if (isFurnished !== '') {
      filtered = filtered.filter(property => property.is_furnished === (isFurnished === 'true'));
    }
    
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setLocationSearch(''); // Clear location search
    setLeaseDuration('');
    setIsFurnished('');
    setFilteredProperties(properties);
  };

  useEffect(() => {
    applyFilters();
  }, [minPrice, maxPrice, location, locationSearch, leaseDuration, isFurnished]); // Add locationSearch to dependencies

  if (loading) {
    return <div className="text-center text-neutral">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-6">Available Properties</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Budget Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral">Budget Range</label>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-neutral" />
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-neutral">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral">Location</label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-neutral" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Location Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral">Search Location</label>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-neutral" />
              <input
                type="text"
                placeholder="Search by location or address"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Lease Duration Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral">Lease Duration</label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-neutral" />
              <select
                value={leaseDuration}
                onChange={(e) => setLeaseDuration(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Any Duration</option>
                {leaseDurations.map(duration => (
                  <option key={duration} value={duration}>{duration} months</option>
                ))}
              </select>
            </div>
          </div>

          {/* Furnished Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral">Furnished Status</label>
            <div className="flex items-center space-x-2">
              <Sofa className="h-5 w-5 text-neutral" />
              <select
                value={isFurnished}
                onChange={(e) => setIsFurnished(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Any</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(minPrice || maxPrice || location || locationSearch || leaseDuration || isFurnished) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-neutral hover:text-primary transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold text-primary">{property.title}</h2>
              <p className="text-2xl font-bold text-secondary">${property.price}/month</p>
              <p className="text-neutral">{property.address}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-neutral">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{property.lease_duration} months</span>
                </div>
                <div className="flex items-center">
                  <Sofa className="h-4 w-4 mr-1" />
                  <span>{property.is_furnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-neutral text-lg">No properties found with the selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary hover:text-primary-hover transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}