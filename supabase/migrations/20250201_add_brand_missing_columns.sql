-- Add missing columns to brand_kits table
-- This migration adds columns that were in the original migration but not applied

-- Add enabled column
ALTER TABLE brand_kits 
ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;

-- Add example_phrases column
ALTER TABLE brand_kits 
ADD COLUMN IF NOT EXISTS example_phrases TEXT[];

-- Update existing rows to ensure enabled is set
UPDATE brand_kits 
SET enabled = true 
WHERE enabled IS NULL;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

