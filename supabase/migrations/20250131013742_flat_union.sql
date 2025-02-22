/*
  # Housing Platform Schema

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `address` (text)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `square_feet` (numeric)
      - `images` (text array)
      - `amenities` (text array)
      - `landlord_name` (text)
      - `landlord_email` (text)
      - `landlord_phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  address text NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  square_feet numeric NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  landlord_name text NOT NULL,
  landlord_email text NOT NULL,
  landlord_phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON properties
  FOR SELECT
  TO public
  USING (true);