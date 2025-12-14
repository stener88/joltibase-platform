-- ============================================
-- URGENT FIX: Create update_list_contact_count function
-- ============================================
-- Run this in your Supabase SQL Editor if the function doesn't exist

-- Drop existing function if it exists (to ensure clean install)
DROP FUNCTION IF EXISTS update_list_contact_count(UUID);

-- Create the function
CREATE OR REPLACE FUNCTION update_list_contact_count(list_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE lists
  SET contact_count = (
    SELECT COUNT(*)
    FROM contact_lists
    WHERE list_id = list_uuid
  ),
  updated_at = NOW()
  WHERE id = list_uuid;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_list_contact_count(UUID) TO authenticated;

-- Test the function (replace with your actual list ID)
-- SELECT update_list_contact_count('your-list-id-here');

-- Verify the function was created
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'update_list_contact_count';

-- Expected output:
-- routine_name              | routine_type | data_type
-- update_list_contact_count | FUNCTION     | void

