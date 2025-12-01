-- Add validation tracking columns to campaigns_v3
-- Migration: Add validation metadata for Phase 1 improvements

-- Add new columns for validation tracking
ALTER TABLE campaigns_v3
ADD COLUMN IF NOT EXISTS generation_attempts INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS validation_issues JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ready' CHECK (status IN ('ready', 'needs_review', 'error', 'draft', 'sent'));

-- Create index for filtering by status
CREATE INDEX IF NOT EXISTS idx_campaigns_v3_status ON campaigns_v3(status);

-- Create index for campaigns with validation issues
CREATE INDEX IF NOT EXISTS idx_campaigns_v3_has_issues ON campaigns_v3((jsonb_array_length(validation_issues) > 0));

-- Add comment to explain new columns
COMMENT ON COLUMN campaigns_v3.generation_attempts IS 'Number of AI generation attempts needed (1-3)';
COMMENT ON COLUMN campaigns_v3.validation_issues IS 'Array of validation issues: [{severity, type, message}]';
COMMENT ON COLUMN campaigns_v3.status IS 'Campaign status: ready (no errors), needs_review (has warnings/errors), error (generation failed), draft (user editing), sent (sent to recipients)';

