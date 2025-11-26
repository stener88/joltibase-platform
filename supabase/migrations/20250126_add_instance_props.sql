-- Add instance_props and last_finalized columns to campaigns_v2
-- For React-first visual editor architecture

ALTER TABLE campaigns_v2
  ADD COLUMN IF NOT EXISTS instance_props JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_finalized TIMESTAMP WITH TIME ZONE;

-- Add index for instance_props queries (if needed)
CREATE INDEX IF NOT EXISTS idx_campaigns_v2_instance_props ON campaigns_v2 USING GIN (instance_props);

