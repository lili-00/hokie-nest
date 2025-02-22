export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  images: string[];
  amenities: string[];
  landlord_name: string;
  landlord_email: string;
  landlord_phone: string;
  lease_duration: number;
  is_furnished: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactInquiry = {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};