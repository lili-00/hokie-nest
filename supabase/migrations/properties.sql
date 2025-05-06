/*
  # Create properties table

  1. New Tables
    - `properties`
      - Basic Info:
        - `id` (uuid, primary key)
        - `title` (text)
        - `description` (text)
        - `address` (text)
        - `price` (integer)
        - `bedrooms` (integer)
        - `bathrooms` (integer)
        - `square_feet` (integer)
        - `location` (text)
      - Status and Features:
        - `status` (text, check constraint)
        - `amenities` (text array)
        - `highlights` (text array)
        - `images` (text array)
        - `is_furnished` (boolean)
        - `transportation` (jsonb)
      - Landlord Info:
        - `landlord_id` (uuid, references auth.users)
        - `landlord_name` (text)
        - `landlord_email` (text)
        - `landlord_phone` (text)
      - Metadata:
        - `reviews_count` (integer)
        - `created_at` (timestamptz)
        - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for:
      - Public read access
      - Landlords can only modify their own properties
*/

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  price INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  square_feet INTEGER NOT NULL,
  location TEXT NOT NULL,
  landlord_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('available', 'rented', 'maintenance')),
  amenities TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_furnished BOOLEAN DEFAULT false,
  transportation JSONB DEFAULT '{}',
  landlord_name TEXT NOT NULL,
  landlord_email TEXT NOT NULL,
  landlord_phone TEXT DEFAULT '',
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON properties
  FOR SELECT
  USING (true);

CREATE POLICY "Landlords can insert own properties"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own properties"
  ON properties
  FOR UPDATE
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own properties"
  ON properties
  FOR DELETE
  USING (auth.uid() = landlord_id);