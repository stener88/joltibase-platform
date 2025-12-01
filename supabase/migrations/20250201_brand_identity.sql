-- Brand Identity System
-- Stores user-specific brand kits with visual identity and voice/tone settings

-- Brand Kits Table
CREATE TABLE IF NOT EXISTS brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Visual Identity
  company_name TEXT NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#5f6ad1',
  secondary_color TEXT,
  logo_url TEXT,
  
  -- Voice & Tone
  tone TEXT CHECK (tone IN ('professional', 'friendly', 'casual', 'luxurious', 'playful')),
  formality TEXT CHECK (formality IN ('formal', 'conversational', 'casual')),
  personality TEXT,
  example_phrases TEXT[], -- Array of brand voice examples
  
  -- Settings
  enabled BOOLEAN DEFAULT true, -- Toggle to enable/disable brand application
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One brand kit per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own brand kit"
  ON brand_kits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand kit"
  ON brand_kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand kit"
  ON brand_kits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand kit"
  ON brand_kits FOR DELETE
  USING (auth.uid() = user_id);

-- Storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'brand-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-logos');

CREATE POLICY "Users can update own logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'brand-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'brand-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_brand_kits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_kits_updated_at
  BEFORE UPDATE ON brand_kits
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_kits_updated_at();

