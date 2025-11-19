# Database Migration for Email V2

## Migration File
`migrations/add_email_v2_fields.sql`

## What It Does
Adds support for React Email V2 system alongside existing V1 block system.

## Changes

### New Fields

1. **`version`** (VARCHAR(10), default: 'v1')
   - Identifies which email system the campaign uses
   - Values: 'v1' (blocks) or 'v2' (React Email)
   - All existing campaigns automatically get 'v1'

2. **`root_component`** (JSONB, nullable)
   - Stores the React Email component tree
   - Only populated for v2 campaigns
   - Structure: `{ component: 'Html', children: [...] }`

3. **Index on `version`**
   - Speeds up queries filtering by version
   - Useful for analytics and reporting

## How to Apply

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `migrations/add_email_v2_fields.sql`
3. Run the SQL
4. Verify in Table Editor that new columns exist

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Direct SQL (if you have access)
```bash
psql $DATABASE_URL < migrations/add_email_v2_fields.sql
```

## Backwards Compatibility ✅

**Existing campaigns (v1):**
- Continue to work exactly as before
- Use `blocks` field for content
- Use `design_config` for settings
- Rendered by old renderer

**New campaigns (v2):**
- Use `root_component` for content
- Still have `blocks` (empty) for compatibility
- Rendered by new React Email renderer

## Verification

After migration, verify with:

```sql
-- Check that version column exists with default
SELECT version, COUNT(*) 
FROM campaigns 
GROUP BY version;

-- Should show: v1 | (count of existing campaigns)

-- Check that root_component column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'campaigns' 
  AND column_name IN ('version', 'root_component');
```

## Rollback (if needed)

```sql
-- Remove the new fields (NOT RECOMMENDED - data loss)
ALTER TABLE campaigns 
  DROP COLUMN IF EXISTS version,
  DROP COLUMN IF EXISTS root_component;

DROP INDEX IF EXISTS idx_campaigns_version;
```

## Next Steps

After migration:
1. ✅ Existing campaigns continue working (v1)
2. ✅ New v2 APIs (`/api/ai/generate-email`) can save to `root_component`
3. ✅ Dual rendering system works based on `version` field

---

**Status:** Ready to apply
**Risk:** Low (backwards compatible)
**Estimated time:** < 1 minute

