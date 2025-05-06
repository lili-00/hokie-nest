/*
  # Add mock property data

  1. Changes
    - Insert mock property data for testing
    - Properties are located near Virginia Tech Innovation Campus
    - Realistic amenities and features
    - Realistic pricing based on Alexandria market
*/

INSERT INTO public.properties (
  title,
  description,
  address,
  price,
  bedrooms,
  bathrooms,
  square_feet,
  location,
  status,
  amenities,
  highlights,
  images,
  is_furnished,
  transportation,
  landlord_name,
  landlord_email,
  landlord_phone
) VALUES
(
  'Luxury Potomac Yard Apartment',
  'Modern luxury apartment with stunning views of the Potomac River. Walking distance to Virginia Tech Innovation Campus. Features high-end finishes, smart home technology, and resort-style amenities.',
  '2901 Potomac Ave, Alexandria, VA 22305',
  2800,
  2,
  2,
  1150,
  'Potomac Yard, Alexandria',
  'available',
  ARRAY['In-unit Washer/Dryer', 'Central AC', 'Dishwasher', 'Hardwood Floors', 'Smart Thermostat', 'Stainless Steel Appliances'],
  ARRAY['5 minute walk to VT Campus', 'Rooftop lounge', 'Pet-friendly', 'Package lockers'],
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80'],
  false,
  jsonb_build_object(
    'metro', 'Potomac Yard Metro Station (0.2 miles)',
    'bus', 'Metroway Bus Stop (0.1 miles)',
    'bike', 'Capital Bikeshare Station on-site'
  ),
  'Sarah Thompson',
  'sarah.thompson@realtor.com',
  '(703) 555-0123'
),
(
  'Modern Studio near Tech Campus',
  'Efficient studio apartment perfect for graduate students. Recently renovated with modern amenities and excellent location near campus and shopping.',
  '3101 Potomac Ave, Alexandria, VA 22305',
  1750,
  0,
  1,
  550,
  'Potomac Yard, Alexandria',
  'available',
  ARRAY['In-unit Washer/Dryer', 'Central AC', 'Dishwasher', 'Built-in Desk', 'Bike Storage'],
  ARRAY['7 minute walk to VT Campus', 'Fitness center', 'Study rooms'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'],
  true,
  jsonb_build_object(
    'metro', 'Potomac Yard Metro Station (0.3 miles)',
    'bus', 'Metroway Bus Stop (0.2 miles)'
  ),
  'Michael Chen',
  'michael.chen@realtor.com',
  '(703) 555-0456'
),
(
  'Spacious 3BR Townhouse',
  'Beautiful townhouse perfect for roommates or family. Features a private backyard, garage parking, and modern updates throughout. Ideal location near campus and amenities.',
  '2805 Main Line Blvd, Alexandria, VA 22301',
  3500,
  3,
  2.5,
  1800,
  'Potomac Yard, Alexandria',
  'available',
  ARRAY['Central AC', 'Dishwasher', 'Garage', 'Private Backyard', 'Fireplace', 'Storage Space'],
  ARRAY['10 minute walk to VT Campus', 'Private entrance', 'Recently renovated'],
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80'],
  false,
  jsonb_build_object(
    'metro', 'Potomac Yard Metro Station (0.4 miles)',
    'parking', 'Two-car garage',
    'bike', 'Bike trail access'
  ),
  'David Wilson',
  'david.wilson@realtor.com',
  '(703) 555-0789'
),
(
  'Cozy 1BR with City Views',
  'Charming one-bedroom apartment with panoramic views of Alexandria. Modern kitchen, large windows, and excellent amenities. Perfect for young professionals or graduate students.',
  '2705 Richmond Hwy, Alexandria, VA 22301',
  2200,
  1,
  1,
  750,
  'Potomac Yard, Alexandria',
  'available',
  ARRAY['In-unit Washer/Dryer', 'Central AC', 'Dishwasher', 'Floor-to-Ceiling Windows', 'Quartz Countertops'],
  ARRAY['12 minute walk to VT Campus', 'Pool access', 'Dog park on-site'],
  ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80'],
  false,
  jsonb_build_object(
    'metro', 'Potomac Yard Metro Station (0.5 miles)',
    'bus', 'Richmond Hwy Bus Stop (0.1 miles)'
  ),
  'Emily Rodriguez',
  'emily.rodriguez@realtor.com',
  '(703) 555-0321'
);