-- V3 Campaigns Table
-- Clean rebuild with wrapper-free component architecture

CREATE TABLE campaigns_v3 (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Campaign metadata
  name TEXT,
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'scheduled', 'sent')),
  
  -- Code generation (wrapper-free components)
  component_filename TEXT NOT NULL,        -- e.g., "Email_1737849600_abc123.tsx"
  component_code TEXT NOT NULL,            -- Full TSX source code (fragment root, no wrappers)
  html_content TEXT NOT NULL,              -- Rendered HTML (with wrappers applied)
  default_props JSONB DEFAULT '{}',        -- Default props for component
  
  -- RAG metadata
  patterns_used TEXT[],                    -- Which patterns were used in generation
  generation_prompt TEXT,                  -- Original user prompt
  
  -- Versioning
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES campaigns_v3(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_campaigns_v3_user ON campaigns_v3(user_id);
CREATE INDEX idx_campaigns_v3_status ON campaigns_v3(status);
CREATE INDEX idx_campaigns_v3_filename ON campaigns_v3(component_filename);
CREATE INDEX idx_campaigns_v3_created ON campaigns_v3(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE campaigns_v3 ENABLE ROW LEVEL SECURITY;

-- Users can only view their own campaigns
CREATE POLICY "Users can view own campaigns_v3" 
ON campaigns_v3 FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own campaigns
CREATE POLICY "Users can insert own campaigns_v3" 
ON campaigns_v3 FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own campaigns
CREATE POLICY "Users can update own campaigns_v3" 
ON campaigns_v3 FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own campaigns
CREATE POLICY "Users can delete own campaigns_v3" 
ON campaigns_v3 FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaigns_v3_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_v3_updated_at
BEFORE UPDATE ON campaigns_v3
FOR EACH ROW
EXECUTE FUNCTION update_campaigns_v3_updated_at();

