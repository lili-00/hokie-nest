/*
  # Insert sample properties

  1. Data Population
    - Adds 6 sample properties with realistic details
    - Includes varied property types (apartments, houses)
    - Provides realistic pricing and amenities
    - Includes sample landlord information
*/

INSERT INTO properties (
  title,
  description,
  price,
  address,
  bedrooms,
  bathrooms,
  square_feet,
  images,
  amenities,
  landlord_name,
  landlord_email,
  landlord_phone
) VALUES
(
  'Modern Student Apartment near Campus',
  'Newly renovated apartment perfect for students. Walking distance to campus with high-speed internet and modern appliances. Features a spacious living area and a dedicated study space.',
  1200,
  '123 College Ave, University City',
  2,
  1,
  850,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  ],
  ARRAY['High-speed Internet', 'Air Conditioning', 'In-unit Laundry', 'Study Room', 'Bike Storage'],
  'John Smith',
  'john.smith@email.com',
  '(555) 123-4567'
),
(
  'Cozy Studio in Student District',
  'Perfect for single students! This well-maintained studio apartment includes all utilities and features modern amenities. Located in a quiet neighborhood with easy access to public transportation.',
  850,
  '456 University Way',
  1,
  1,
  400,
  ARRAY[
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
    'https://images.unsplash.com/photo-1598528644866-3215eb3e9771'
  ],
  ARRAY['Utilities Included', 'Furnished', 'Security System', 'High-speed Internet'],
  'Mary Johnson',
  'mary.j@email.com',
  '(555) 234-5678'
),
(
  'Spacious 3BR House for Student Group',
  'Large house perfect for a group of students. Features a full kitchen, spacious common areas, and a backyard. Close to campus and local amenities.',
  2200,
  '789 Campus Drive',
  3,
  2,
  1500,
  ARRAY[
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
  ],
  ARRAY['Backyard', 'Parking', 'Dishwasher', 'Central Heat/AC', 'Pet Friendly', 'Storage Space'],
  'Robert Wilson',
  'robert.w@email.com',
  '(555) 345-6789'
),
(
  'Modern 2BR with Study Lounge',
  'Contemporary apartment featuring a dedicated study lounge and high-end finishes. Includes smart home features and premium appliances.',
  1600,
  '321 Scholar Street',
  2,
  2,
  1000,
  ARRAY[
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
  ],
  ARRAY['Study Lounge', 'Smart Home Features', 'Gym Access', 'Package Lockers', 'High-speed Internet'],
  'Sarah Brown',
  'sarah.b@email.com',
  '(555) 456-7890'
),
(
  'Budget-Friendly Student Room',
  'Affordable private room in a shared house. All utilities included with access to common areas. Perfect for students on a budget.',
  600,
  '555 Economy Lane',
  1,
  1,
  200,
  ARRAY[
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  ],
  ARRAY['Utilities Included', 'Shared Kitchen', 'Laundry Access', 'WiFi', 'Study Desk'],
  'David Lee',
  'david.l@email.com',
  '(555) 567-8901'
),
(
  'Luxury Student Apartment with Pool',
  'High-end student living with resort-style amenities. Features a swimming pool, fitness center, and modern security system.',
  1800,
  '999 Luxury Drive',
  2,
  2,
  1100,
  ARRAY[
    'https://images.unsplash.com/photo-1515263487990-61b07816b324',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
  ],
  ARRAY['Swimming Pool', 'Fitness Center', '24/7 Security', 'Business Center', 'Covered Parking', 'Package Service'],
  'Patricia Garcia',
  'patricia.g@email.com',
  '(555) 678-9012'
);