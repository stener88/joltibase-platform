-- ============================================
-- CHAT HISTORY PERSISTENCE MIGRATION
-- ============================================
-- Date: 2025
-- Purpose: Add server-side persistence for chat history to enable cross-device sync

-- ============================================
-- 1. UPDATE CAMPAIGNS TABLE
-- ============================================
-- Add chat_history column to store chat messages for each campaign

-- Add chat_history column (jsonb array of ChatMessage objects)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS chat_history jsonb DEFAULT NULL;

-- Add index for faster chat history queries
CREATE INDEX IF NOT EXISTS idx_campaigns_chat_history ON campaigns USING GIN (chat_history);

-- Add comment for documentation
COMMENT ON COLUMN campaigns.chat_history IS 'Chat history for campaign refinement. Stores array of ChatMessage objects: [{role: "user"|"assistant", content: string, timestamp: string}]. Timestamps are ISO strings for JSON compatibility.';

