import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  UserCircle, 
  Mail, 
  Phone, 
  LogOut, 
  Home,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    description: '',
    address: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    property_type: 'apartment' as 'apartment' | 'studio',
    status: 'available' as 'available' | 'rented' | 'maintenance',
    amenities: [] as string[],
    highlights: [] as string[],
    images: [] as string[],
    is_furnished: false,
    transportation: {
      bus: '',
      bike: '',
      parking: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name,
          phone: profileData.phone || '',
        });

        // If user is a landlord, fetch their properties
        if (profileData.role === 'landlord') {
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .eq('landlord_id', user.id)
            .order('created_at', { ascending: false });

          if (propertiesError) throw propertiesError;
          setProperties(propertiesData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setUpdating(true);
    setError(null);

    try {
      const propertyData = {
        ...propertyFormData,
        price: parseInt(propertyFormData.price),
        bedrooms: propertyFormData.property_type === 'studio' ? 0 : parseInt(propertyFormData.bedrooms),
        bathrooms: parseInt(propertyFormData.bathrooms),
        square_feet: parseInt(propertyFormData.square_feet),
        landlord_id: user.id,
        landlord_name: profile.full_name,
        landlord_email: user.email || '',
        landlord_phone: profile.phone || '',
        status: propertyFormData.status,
        property_type: propertyFormData.property_type,
        amenities: propertyFormData.amenities.filter(Boolean),
        highlights: propertyFormData.highlights.filter(Boolean),
        images: propertyFormData.images.filter(Boolean),
        transportation: propertyFormData.transportation,
      };

      if (editingProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
      } else {
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
      }

      // Refresh properties list
      const { data: updatedProperties, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProperties(updatedProperties || []);

      // Reset form
      setPropertyFormData({
        title: '',
        description: '',
        address: '',
        location: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        property_type: 'apartment',
        status: 'available',
        amenities: [],
        highlights: [],
        images: [],
        is_furnished: false,
        transportation: {
          bus: '',
          bike: '',
          parking: '',
        },
      });
      setShowNewPropertyForm(false);
      setEditingProperty(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(properties.filter(p => p.id !== propertyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setPropertyFormData({
      title: property.title,
      description: property.description,
      address: property.address,
      location: property.location,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      square_feet: property.square_feet.toString(),
      property_type: property.property_type,
      status: property.status || 'available',
      amenities: property.amenities || [],
      highlights: property.highlights || [],
      images: property.images || [],
      is_furnished: property.is_furnished || false,
      transportation: property.transportation || {
        bus: '',
        bike: '',
        parking: '',
      },
    });
    setShowNewPropertyForm(true);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Profile not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary px-6 py-4">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-12 w-12 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                  <p className="text-primary-hover capitalize">{profile.role}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="bg-gray-50 focus:ring-primary focus:border-primary block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Properties Section (Only for landlords) */}
        {profile.role === 'landlord' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                <button
                  onClick={() => {
                    setShowNewPropertyForm(!showNewPropertyForm);
                    setEditingProperty(null);
                    setPropertyFormData({
                      title: '',
                      description: '',
                      address: '',
                      location: '',
                      price: '',
                      bedrooms: '',
                      bathrooms: '',
                      square_feet: '',
                      property_type: 'apartment',
                      status: 'available',
                      amenities: [],
                      highlights: [],
                      images: [],
                      is_furnished: false,
                      transportation: {
                        bus: '',
                        bike: '',
                        parking: '',
                      },
                    });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </button>
              </div>

              {showNewPropertyForm && (
                <div className="mb-8 bg-gray-50 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-6">
                    {editingProperty ? 'Edit Property' : 'New Property'}
                  </h3>
                  <form onSubmit={handlePropertySubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={propertyFormData.title}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Enter a descriptive title"
                        />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Property Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={propertyFormData.address}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, address: e.target.value }))}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Enter the full address"
                        />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={propertyFormData.location}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, location: e.target.value }))}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Enter the location (e.g., Arlington, VA)"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          value={propertyFormData.price}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, price: e.target.value }))}
                          required
                          min="0"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Enter monthly rent"
                        />
                      </div>

                      <div>
                        <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>
                        <select
                          id="property_type"
                          value={propertyFormData.property_type}
                          onChange={(e) => setPropertyFormData(prev => ({ 
                            ...prev, 
                            property_type: e.target.value as 'apartment' | 'studio',
                            bedrooms: e.target.value === 'studio' ? '0' : prev.bedrooms
                          }))}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                        >
                          <option value="apartment">Apartment</option>
                          <option value="studio">Studio</option>
                        </select>
                      </div>

                      {propertyFormData.property_type === 'apartment' && (
                        <div>
                          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                            Bedrooms
                          </label>
                          <input
                            type="number"
                            id="bedrooms"
                            value={propertyFormData.bedrooms}
                            onChange={(e) => setPropertyFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                            required
                            min="1"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                            placeholder="Number of bedrooms"
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          id="bathrooms"
                          value={propertyFormData.bathrooms}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                          required
                          min="1"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Number of bathrooms"
                        />
                      </div>

                      <div>
                        <label htmlFor="square_feet" className="block text-sm font-medium text-gray-700 mb-2">
                          Square Feet
                        </label>
                        <input
                          type="number"
                          id="square_feet"
                          value={propertyFormData.square_feet}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, square_feet: e.target.value }))}
                          required
                          min="0"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                          placeholder="Total square footage"
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          id="status"
                          value={propertyFormData.status}
                          onChange={(e) => setPropertyFormData(prev => ({ 
                            ...prev, 
                            status: e.target.value as 'available' | 'rented' | 'maintenance'
                          }))}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                        >
                          <option value="available">Available</option>
                          <option value="rented">Rented</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Property Description
                        </label>
                        <textarea
                          id="description"
                          value={propertyFormData.description}
                          onChange={(e) => setPropertyFormData(prev => ({ ...prev, description: e.target.value }))}
                          required
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          placeholder="Describe the property and its features..."
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Images
                        </label>
                        <textarea
                          value={propertyFormData.images.join('\n')}
                          onChange={(e) => setPropertyFormData(prev => ({ 
                            ...prev, 
                            images: e.target.value.split('\n').filter(url => url.trim())
                          }))}
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          placeholder="Enter image URLs (one per line)"
                        />
                        <p className="mt-2 text-sm text-gray-500">Add URLs of property images, one per line</p>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities
                        </label>
                        <textarea
                          value={propertyFormData.amenities.join('\n')}
                          onChange={(e) => setPropertyFormData(prev => ({ 
                            ...prev, 
                            amenities: e.target.value.split('\n').filter(item => item.trim())
                          }))}
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          placeholder="Enter amenities (one per line)&#10;Example:&#10;WiFi&#10;Washer/Dryer&#10;Parking"
                        />
                        <p className="mt-2 text-sm text-gray-500">List all amenities, one per line</p>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Highlights
                        </label>
                        <textarea
                          value={propertyFormData.highlights.join('\n')}
                          onChange={(e) => setPropertyFormData(prev => ({ 
                            ...prev, 
                            highlights: e.target.value.split('\n').filter(item => item.trim())
                          }))}
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          placeholder="Enter highlights (one per line)&#10;Example:&#10;Recently renovated&#10;Close to campus&#10;Quiet neighborhood"
                        />
                        <p className="mt-2 text-sm text-gray-500">List key highlights, one per line</p>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="is_furnished"
                            checked={propertyFormData.is_furnished}
                            onChange={(e) => setPropertyFormData(prev => ({ 
                              ...prev, 
                              is_furnished: e.target.checked
                            }))}
                            className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="is_furnished" className="ml-3 block text-sm text-gray-900">
                            This property is furnished
                          </label>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Transportation Options</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="bus" className="block text-sm text-gray-700 mb-2">
                              Bus Service
                            </label>
                            <input
                              type="text"
                              id="bus"
                              value={propertyFormData.transportation.bus}
                              onChange={(e) => setPropertyFormData(prev => ({ 
                                ...prev, 
                                transportation: { ...prev.transportation, bus: e.target.value }
                              }))}
                              placeholder="BT Stop nearby"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="bike" className="block text-sm text-gray-700 mb-2">
                              Bike Access
                            </label>
                            <input
                              type="text"
                              id="bike"
                              value={propertyFormData.transportation.bike}
                              onChange={(e) => setPropertyFormData(prev => ({ 
                                ...prev, 
                                transportation: { ...prev.transportation, bike: e.target.value }
                              }))}
                              placeholder="Bike rack available"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="parking" className="block text-sm text-gray-700 mb-2">
                              Parking
                            </label>
                            <input
                              type="text"
                              id="parking"
                              value={propertyFormData.transportation.parking}
                              onChange={(e) => setPropertyFormData(prev => ({ 
                                ...prev, 
                                transportation: { ...prev.transportation, parking: e.target.value }
                              }))}
                              placeholder="2 parking spots"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewPropertyForm(false);
                          setEditingProperty(null);
                        }}
                        className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      >
                        {updating ? 'Saving...' : (editingProperty ? 'Update Property' : 'Add Property')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="w-full md:w-48 h-32">
                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80'}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{property.title}</h3>
                          <span className="inline-block px-2 py-1 text-sm rounded-full bg-gray-200 text-gray-700 mt-1">
                            {property.property_type === 'studio' ? 'Studio' : `${property.bedrooms} Bedroom`}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{property.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{property.price.toLocaleString()}/mo</span>
                        </div>
                        {property.property_type === 'apartment' && (
                          <div className="flex items-center text-gray-600">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.square_feet} sqft</span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <Link
                          to={`/properties/${property.id}`}
                          className="text-primary hover:text-primary-hover font-medium"
                        >
                          View Listing
                        </Link>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="text-red-600 hover:text-red-700 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {properties.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No properties listed</h3>
                    <p className="mt-2 text-gray-500">Add your first property to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}