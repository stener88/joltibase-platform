-- Sender Addresses Table
-- Auto-generated sender addresses for each user (username@mail.joltibase.com)

CREATE TABLE IF NOT EXISTS sender_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sender details
  email TEXT NOT NULL,  -- e.g., "stener88@mail.joltibase.com"
  name TEXT NOT NULL,   -- Display name: "Stener Hansen"
  
  -- Status
  is_default BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT true, -- Auto-verified for @mail.joltibase.com addresses
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, email)
);

-- Indexes for performance
CREATE INDEX idx_sender_addresses_user ON sender_addresses(user_id);
CREATE INDEX idx_sender_addresses_default ON sender_addresses(user_id, is_default) WHERE is_default = true;

-- Ensure only one default sender per user (partial unique index)
CREATE UNIQUE INDEX idx_sender_addresses_one_default_per_user 
  ON sender_addresses(user_id) 
  WHERE is_default = true;

-- Enable RLS
ALTER TABLE sender_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sender addresses"
  ON sender_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sender addresses"
  ON sender_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sender addresses"
  ON sender_addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sender addresses"
  ON sender_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_sender_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sender_addresses_updated_at
  BEFORE UPDATE ON sender_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_sender_addresses_updated_at();

-- Comment
COMMENT ON TABLE sender_addresses IS 'User sender addresses for email campaigns. Each user gets a default @mail.joltibase.com address.';
