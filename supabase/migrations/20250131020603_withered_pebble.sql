/*
  # Create contact inquiries table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)
      - `status` (text) - For tracking inquiry status

  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy for public to create inquiries
    - Add policy for authenticated users to view their own inquiries
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a contact inquiry
CREATE POLICY "Allow public to create contact inquiries"
  ON contact_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to view their own inquiries (based on email)
CREATE POLICY "Users can view their own inquiries"
  ON contact_inquiries
  FOR SELECT
  TO public
  USING (email = current_user);