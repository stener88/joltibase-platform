# 🎯 Step-by-Step Launch Guide

## ✅ Current Status Check

### Environment Variables - Local Setup
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Configured
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configured
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Configured
- ✅ `RESEND_API_KEY` - Configured
- ✅ `GOOGLE_GENERATIVE_AI_API_KEY` - Configured
- ✅ `ANTHROPIC_API_KEY` - Configured
- ✅ `UPSTASH_REDIS_REST_URL` - Configured
- ✅ `NEXT_PUBLIC_APP_URL` - Configured
- ✅ `UNSPLASH_ACCESS_KEY` - Configured

### Missing/Need to Verify
- ⚠️ **Sentry Variables** - Need to check if configured
  - `SENTRY_DSN`
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `SENTRY_AUTH_TOKEN`

---

## 📋 **Step 1: Verify Sentry Configuration**

### Check if Sentry variables exist:

Run in terminal:
```bash
grep -E "SENTRY" .env.local
```

### If missing, get them from:
1. Go to https://sentry.io
2. Your project: **joltibase**
3. Settings → Client Keys (DSN)
4. Copy DSN and add to `.env.local`:

```bash
# Add these to .env.local
SENTRY_DSN=https://...@....ingest.sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@....ingest.sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=joltibase
SENTRY_PROJECT=joltibase
```

**Status:** [ ] Complete

---

## 📋 **Step 2: Apply Supabase Security Migration**

### Current Security Issue:
6 remaining function search path warnings in Supabase

### How to Fix:

1. **Get the functions that need fixing:**

Run this in **Supabase SQL Editor**:
```sql
-- Check which functions still have issues
SELECT 
  proname AS function_name,
  CASE 
    WHEN 'search_path=public' = ANY(proconfig) THEN '✅ Secured'
    ELSE '❌ Not secured'
  END AS status,
  proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND prokind = 'f'
  AND proname IN (
    'get_daily_ai_generation_count',
    'get_monthly_ai_generation_count',
    'get_active_brand_kit',
    'create_default_brand_kit',
    'increment_block_template_usage',
    'campaign_format'
  );
```

2. **If functions exist, fix them:**

For each function that shows up, you'll need to recreate it with `SET search_path = public`.

**Do you see these functions? Let's fix them together.**

**Status:** [ ] Complete

---

## 📋 **Step 3: Clean Up Database**

### Test Data Cleanup

Run in **Supabase SQL Editor**:

```sql
-- Check for test/dev data
SELECT 
  COUNT(*) as total_campaigns,
  COUNT(CASE WHEN name LIKE '%test%' OR name LIKE '%Test%' THEN 1 END) as test_campaigns
FROM campaigns_v3;

-- Check contacts
SELECT COUNT(*) as total_contacts FROM contacts;

-- Check emails sent
SELECT COUNT(*) as total_emails FROM emails;
```

### Clean up if needed:
```sql
-- DELETE TEST DATA (be careful!)
DELETE FROM campaigns_v3 WHERE name ILIKE '%test%';
DELETE FROM contacts WHERE email LIKE '%test%';
-- etc.
```

**Status:** [ ] Complete

---

## 📋 **Step 4: Backup Database**

### Before cleaning or deploying:

1. Go to Supabase Dashboard
2. Database → Backups
3. Click "Create Backup" 
4. Wait for completion

**Status:** [ ] Complete

---

## 📋 **Step 5: Test Production Build Locally**

### Run build command:

```bash
cd /Users/stenerhansen/joltibase-platform
npm run build
```

### What to check:
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ No missing environment variables
- ✅ Bundle size reasonable

### If errors:
- Fix them before deploying
- Run `npm run build` again

**Status:** [ ] Complete

---

## 📋 **Step 6: Deploy to Vercel**

### Option A: GitHub Auto-Deploy (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Vercel auto-detects Next.js settings
   - Click Deploy

3. **Add Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Copy ALL variables from your `.env.local`
   - Add each one for Production, Preview, Development

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Status:** [ ] Complete

---

## 📋 **Step 7: Configure Production Domain**

### After Vercel deployment:

1. **Get your Vercel URL:**
   - Example: `joltibase-platform.vercel.app`

2. **Update Environment Variable:**
   - In Vercel: Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL=https://joltibase-platform.vercel.app`
   - Redeploy

3. **Optional - Custom Domain:**
   - Vercel Settings → Domains
   - Add your custom domain
   - Update DNS records
   - Update `NEXT_PUBLIC_APP_URL` again

**Status:** [ ] Complete

---

## 📋 **Step 8: Test Production**

### Complete User Flow Test:

1. **Visit production URL**
2. **Test signup:** Create new account
3. **Test email generation:** Create a campaign
4. **Test refinement:** Edit via chat
5. **Test sending:** Send test email
6. **Test analytics:** Check dashboard
7. **Check Sentry:** Visit https://sentry.io for errors

### Verify:
- [ ] No console errors
- [ ] Images load correctly
- [ ] Costs log accurately
- [ ] Emails arrive
- [ ] Analytics work

**Status:** [ ] Complete

---

## 📋 **Step 9: Monitor Launch Day**

### Watch These:

1. **Vercel Dashboard:**
   - Functions (check for timeouts)
   - Logs (check for errors)
   - Analytics (traffic)

2. **Sentry Dashboard:**
   - Errors
   - Performance
   - User sessions

3. **Supabase Dashboard:**
   - Database load
   - API requests
   - Storage usage

**Status:** [ ] Complete

---

## 🎉 **Step 10: Launch!**

### You're ready when:
- ✅ All steps above complete
- ✅ Production tested
- ✅ No critical errors
- ✅ Monitoring active

### Announce:
- Social media
- Email list
- Product Hunt (optional)
- HackerNews (optional)

**Status:** [ ] Complete

---

## 🆘 **Emergency Rollback**

If something breaks badly:

```bash
# In Vercel Dashboard
# → Deployments → Find last working deployment → Promote to Production
```

Or switch AI model back:
```typescript
// lib/ai/config.ts
export const AI_PROVIDER = 'anthropic'; // Switch back to Haiku
```

---

## 📞 **Quick Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Sentry Dashboard:** https://joltibase.sentry.io
- **GitHub Repo:** (your repo URL)

---

**Current Step: 1 of 10**

**Ready to start with Step 1 (Sentry check)?** 🚀
