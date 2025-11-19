-- Migration: Add React Email V2 support to campaigns table
-- Description: Adds version and root_component fields for React Email system
-- Safe: Backwards compatible, existing campaigns default to v1

-- Add version field to distinguish v1 (blocks) vs v2 (React Email)
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS version VARCHAR(10) DEFAULT 'v1';

-- Add root_component field to store React Email component tree
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS root_component JSONB;

-- Add index on version for faster queries
CREATE INDEX IF NOT EXISTS idx_campaigns_version ON campaigns(version);

-- Add comments for documentation
COMMENT ON COLUMN campaigns.version IS 'Email system version: v1 (blocks) or v2 (React Email)';
COMMENT ON COLUMN campaigns.root_component IS 'React Email component tree (JSONB) for v2 campaigns';

