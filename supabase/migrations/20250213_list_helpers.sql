-- Helper function for updating list contact counts
-- This should be called whenever contacts are added/removed from lists

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

