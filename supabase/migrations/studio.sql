/*
  # Add studio property type

  1. Changes
    - Add property_type column to properties table
    - Set default value to 'apartment'
    - Add check constraint for valid property types
    - Update existing rows to have 'apartment' type
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'property_type'
  ) THEN
    ALTER TABLE properties 
    ADD COLUMN property_type text NOT NULL DEFAULT 'apartment';

    ALTER TABLE properties 
    ADD CONSTRAINT properties_type_check 
    CHECK (property_type IN ('studio', 'apartment'));
  END IF;
END $$;