-- Email Sending Infrastructure for V3 Campaigns
-- Adds support for sending emails, tracking, and campaign statistics

-- ============================================
-- 1. Add email sending fields to campaigns_v3
-- ============================================
ALTER TABLE campaigns_v3
ADD COLUMN IF NOT EXISTS sender_address_id UUID REFERENCES sender_addresses(id),
ADD COLUMN IF NOT EXISTS list_ids UUID[],  -- Array of list IDs to send to
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0}';

-- Update status enum to include new states
-- First, migrate any non-standard status values to valid ones
DO $$
BEGIN
  -- Set any NULL or invalid status to 'draft'
  UPDATE campaigns_v3 
  SET status = 'draft' 
  WHERE status IS NULL 
     OR status NOT IN ('draft', 'ready', 'scheduled', 'sent', 'sending');
END $$;

-- Now drop and recreate the constraint with the new 'sending' state
ALTER TABLE campaigns_v3 DROP CONSTRAINT IF EXISTS campaigns_v3_status_check;
ALTER TABLE campaigns_v3
ADD CONSTRAINT campaigns_v3_status_check
CHECK (status IN ('draft', 'ready', 'scheduled', 'sending', 'sent'));

-- ============================================
-- 2. Update emails table for V3 campaigns compatibility
-- ============================================
-- Note: emails table already exists, just add missing indexes and ensure compatibility

-- Add updated_at column if it doesn't exist
ALTER TABLE emails ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for performance (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_emails_campaign ON emails(campaign_id);
CREATE INDEX IF NOT EXISTS idx_emails_contact ON emails(contact_id);
CREATE INDEX IF NOT EXISTS idx_emails_user ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_resend_message ON emails(resend_message_id);
CREATE INDEX IF NOT EXISTS idx_emails_created ON emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_campaign_status ON emails(campaign_id, status);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS emails_updated_at ON emails;
CREATE TRIGGER emails_updated_at
BEFORE UPDATE ON emails
FOR EACH ROW
EXECUTE FUNCTION update_emails_updated_at();

-- ============================================
-- 3. Create function to update campaign stats
-- ============================================
CREATE OR REPLACE FUNCTION update_campaign_stats(campaign_uuid UUID)
RETURNS void AS $$
DECLARE
  total_sent INTEGER;
  total_delivered INTEGER;
  total_opened INTEGER;
  total_clicked INTEGER;
  total_bounced INTEGER;
  total_unsubscribed INTEGER;
BEGIN
  -- Count emails by status (separate queries for each count)
  SELECT COUNT(*) INTO total_sent
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status IN ('sent', 'delivered', 'opened', 'clicked');

  SELECT COUNT(*) INTO total_delivered
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status IN ('delivered', 'opened', 'clicked');

  SELECT COUNT(*) INTO total_opened
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status IN ('opened', 'clicked');

  SELECT COUNT(*) INTO total_clicked
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status = 'clicked';

  SELECT COUNT(*) INTO total_bounced
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status = 'bounced';

  SELECT COUNT(*) INTO total_unsubscribed
  FROM emails
  WHERE campaign_id = campaign_uuid 
    AND status = 'unsubscribed';

  -- Update campaign stats
  UPDATE campaigns_v3
  SET stats = jsonb_build_object(
    'sent', COALESCE(total_sent, 0),
    'delivered', COALESCE(total_delivered, 0),
    'opened', COALESCE(total_opened, 0),
    'clicked', COALESCE(total_clicked, 0),
    'bounced', COALESCE(total_bounced, 0),
    'unsubscribed', COALESCE(total_unsubscribed, 0)
  )
  WHERE id = campaign_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Add contact_lists junction table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS contact_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contact_id, list_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_lists_contact ON contact_lists(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_lists_list ON contact_lists(list_id);

-- Row Level Security for contact_lists
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own contact_lists" ON contact_lists;
CREATE POLICY "Users can view own contact_lists" 
ON contact_lists FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = contact_lists.contact_id 
    AND contacts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert own contact_lists" ON contact_lists;
CREATE POLICY "Users can insert own contact_lists" 
ON contact_lists FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = contact_lists.contact_id 
    AND contacts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete own contact_lists" ON contact_lists;
CREATE POLICY "Users can delete own contact_lists" 
ON contact_lists FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = contact_lists.contact_id 
    AND contacts.user_id = auth.uid()
  )
);
