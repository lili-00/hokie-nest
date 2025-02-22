import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Property } from '../types/supabase';
import { Bed, Bath, Square, Mail, Phone } from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
      } else {
        setProperty(data);
      }
      setLoading(false);
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading property details...</div>;
  }

  if (!property) {
    return <div className="text-center">Property not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-2xl font-bold text-blue-600">${property.price}/month</p>
        <p className="text-gray-600">{property.address}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {property.images.map((image, index) => (
          <img
            key={index}
            src={image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
            alt={`Property view ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <Bed className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <p className="text-gray-900">{property.bedrooms} Bedrooms</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bath className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <p className="text-gray-900">{property.bathrooms} Bathrooms</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Square className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <p className="text-gray-900">{property.square_feet} sq ft</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p className="text-gray-600">{property.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Amenities</h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {property.amenities.map((amenity, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              {amenity}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Contact Landlord</h2>
        <div className="space-y-2">
          <p className="text-gray-600">{property.landlord_name}</p>
          <div className="flex items-center space-x-4">
            <a
              href={`mailto:${property.landlord_email}`}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-5 w-5 mr-1" />
              {property.landlord_email}
            </a>
            <a
              href={`tel:${property.landlord_phone}`}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Phone className="h-5 w-5 mr-1" />
              {property.landlord_phone}
            </a>
          </div>
        </div>
        <Link
          to={`/contact/${property.id}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </Link>
      </div>
    </div>
  );
}