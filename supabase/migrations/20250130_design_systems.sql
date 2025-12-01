-- Add design system tracking to campaigns_v3
-- Migration: Replace patterns_used with design_system_used

-- Add design_system_used column
ALTER TABLE campaigns_v3
ADD COLUMN IF NOT EXISTS design_system_used TEXT;

-- Add index for filtering by design system
CREATE INDEX IF NOT EXISTS idx_campaigns_v3_design_system 
ON campaigns_v3(design_system_used);

-- Add comment
COMMENT ON COLUMN campaigns_v3.design_system_used IS 'Design system used for generation (e.g., corporate-professional, newsletter-editorial)';

-- Note: patterns_used column can remain for backward compatibility
-- Existing campaigns may have patterns_used, new campaigns will have design_system_used

