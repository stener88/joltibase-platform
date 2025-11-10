-- ============================================
-- PHASE 4A: BLOCK SYSTEM DATABASE MIGRATION
-- ============================================
-- Date: November 10, 2025
-- Purpose: Add block-based email storage to campaigns and create block templates library

-- ============================================
-- 1. UPDATE CAMPAIGNS TABLE
-- ============================================
-- Add blocks column to store email as block-based format (alternative to HTML)

-- Add blocks column (jsonb array of EmailBlock objects)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT NULL;

-- Add design_config column (global email settings)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS design_config jsonb DEFAULT NULL;

-- Add index for faster block queries
CREATE INDEX IF NOT EXISTS idx_campaigns_blocks ON campaigns USING GIN (blocks);

-- Add index for design_config queries
CREATE INDEX IF NOT EXISTS idx_campaigns_design_config ON campaigns USING GIN (design_config);

-- Add comments for documentation
COMMENT ON COLUMN campaigns.blocks IS 'Block-based email structure (Phase 4A). Stores array of EmailBlock objects with granular AI control. NULL = legacy HTML format.';
COMMENT ON COLUMN campaigns.design_config IS 'Global email design settings (Phase 4A). Stores GlobalEmailSettings: backgroundColor, contentBackgroundColor, maxWidth, fontFamily, mobileBreakpoint.';

-- ============================================
-- 2. CREATE BLOCK_TEMPLATES TABLE
-- ============================================
-- Store reusable block patterns for AI learning and user templates

CREATE TABLE IF NOT EXISTS block_templates (
  -- Primary Key
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Template Info
  name text NOT NULL,
  description text,
  category text NOT NULL, -- 'hero', 'cta', 'stats', 'testimonial', etc.
  
  -- Block Data
  blocks jsonb NOT NULL, -- Array of EmailBlock objects
  
  -- Usage Tracking (for AI learning)
  usage_count integer DEFAULT 0,
  
  -- Metadata
  is_public boolean DEFAULT false, -- Allow sharing templates
  tags text[] DEFAULT '{}', -- For search/filtering
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================

-- Index for user's templates
CREATE INDEX IF NOT EXISTS idx_block_templates_user_id 
  ON block_templates(user_id);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_block_templates_category 
  ON block_templates(category);

-- Index for public templates
CREATE INDEX IF NOT EXISTS idx_block_templates_public 
  ON block_templates(is_public) 
  WHERE is_public = true;

-- Index for popular templates (usage tracking)
CREATE INDEX IF NOT EXISTS idx_block_templates_usage 
  ON block_templates(usage_count DESC);

-- GIN index for blocks structure
CREATE INDEX IF NOT EXISTS idx_block_templates_blocks 
  ON block_templates USING GIN (blocks);

-- GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_block_templates_tags 
  ON block_templates USING GIN (tags);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE block_templates ENABLE ROW LEVEL SECURITY;

-- Users can view their own templates
CREATE POLICY "Users can view own block templates"
  ON block_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

-- Users can insert their own templates
CREATE POLICY "Users can insert own block templates"
  ON block_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "Users can update own block templates"
  ON block_templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete own block templates"
  ON block_templates FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_block_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS block_template_updated_at_trigger ON block_templates;
CREATE TRIGGER block_template_updated_at_trigger
  BEFORE UPDATE ON block_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_block_template_updated_at();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_block_template_usage(template_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE block_templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. DATA MIGRATION HELPERS
-- ============================================

-- Function to check if campaign uses blocks or legacy HTML
CREATE OR REPLACE FUNCTION campaign_format(campaign_id uuid)
RETURNS text AS $$
DECLARE
  campaign_blocks jsonb;
BEGIN
  SELECT blocks INTO campaign_blocks
  FROM campaigns
  WHERE id = campaign_id;
  
  IF campaign_blocks IS NULL THEN
    RETURN 'html'; -- Legacy HTML format
  ELSE
    RETURN 'blocks'; -- New block-based format
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VALIDATION CONSTRAINTS
-- ============================================

-- Ensure blocks column is a valid JSON array if not NULL
ALTER TABLE campaigns
ADD CONSTRAINT campaigns_blocks_is_array 
  CHECK (blocks IS NULL OR jsonb_typeof(blocks) = 'array');

-- Ensure design_config column is a valid JSON object if not NULL
ALTER TABLE campaigns
ADD CONSTRAINT campaigns_design_config_is_object 
  CHECK (design_config IS NULL OR jsonb_typeof(design_config) = 'object');

-- Ensure block_templates.blocks is a valid array
ALTER TABLE block_templates
ADD CONSTRAINT block_templates_blocks_is_array 
  CHECK (jsonb_typeof(blocks) = 'array');

-- Ensure category is not empty
ALTER TABLE block_templates
ADD CONSTRAINT block_templates_category_not_empty 
  CHECK (length(trim(category)) > 0);

-- Ensure name is not empty
ALTER TABLE block_templates
ADD CONSTRAINT block_templates_name_not_empty 
  CHECK (length(trim(name)) > 0);

-- ============================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE block_templates IS 'Reusable block patterns for AI learning and user templates (Phase 4A)';
COMMENT ON COLUMN block_templates.blocks IS 'Array of EmailBlock objects representing reusable template pattern';
COMMENT ON COLUMN block_templates.category IS 'Block category: hero, cta, stats, testimonial, feature-grid, etc.';
COMMENT ON COLUMN block_templates.usage_count IS 'Number of times this template has been used (for AI learning)';
COMMENT ON COLUMN block_templates.is_public IS 'Whether this template is shared publicly';
COMMENT ON COLUMN block_templates.tags IS 'Array of tags for search and filtering';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Phase 4A Block System Migration Complete!';
  RAISE NOTICE '✅ Added blocks column to campaigns table';
  RAISE NOTICE '✅ Added design_config column to campaigns table';
  RAISE NOTICE '✅ Created block_templates table';
  RAISE NOTICE '✅ Created indexes for performance (2 for campaigns, 6 for block_templates)';
  RAISE NOTICE '✅ Enabled Row Level Security';
  RAISE NOTICE '✅ Added helper functions';
  RAISE NOTICE '✅ Added validation constraints';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test block creation in campaigns';
  RAISE NOTICE '2. Create initial block templates';
  RAISE NOTICE '3. Update AI to generate blocks';
END $$;

