/*
  # Remove profile security restrictions
  
  1. Changes
    - Drop existing RLS policies for profiles table
    - Create new permissive policies that allow all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new permissive policies
CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users"
ON profiles FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users"
ON profiles FOR UPDATE
TO public
USING (true)
WITH CHECK (true);