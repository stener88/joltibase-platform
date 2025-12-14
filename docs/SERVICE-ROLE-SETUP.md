# 🔐 Service Role Setup - REQUIRED for Email Sending

## What is the Service Role Key?

The **Service Role Key** is a special Supabase key that bypasses Row Level Security (RLS). It's used for:
- ✅ Background jobs (email queue processing)
- ✅ System operations (webhooks, cron jobs)  
- ✅ Server-to-server communication

## Why Do We Need It?

When the `/send` route triggers `/processQueue` via HTTP fetch, the request has **no authentication cookies**. Without the service role key, Supabase RLS blocks all database queries and the queue processor returns 404.

## How to Get Your Service Role Key

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** (gear icon in sidebar)
4. Click **API** in the settings menu

### Step 2: Copy the Service Role Key
Look for the section called **Project API keys**.

You'll see two keys:
- `anon` / `public` - ✅ Safe for client-side (already in your `.env.local`)
- `service_role` - ⚠️ SECRET - Full database access

**Copy the `service_role` key** (it starts with `eyJ...`)

### Step 3: Add to .env.local

Add this line to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-long-key-here...
```

## Security Best Practices

### ✅ DO:
- Store service role key in `.env.local` (never commit to git)
- Use ONLY in API routes (server-side)
- Add validation even with service role
- Use for system/background operations only

### ❌ DON'T:
- Never expose to client-side code
- Never commit to version control
- Never use for user-facing operations
- Never use when RLS should apply

## Verification

After adding the key, restart your dev server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

Then test by sending a campaign. You should see:

```
🔄 [QUEUE-V3] Processing queue for campaign...
📧 [QUEUE-V3] Processing 1 emails
✅ [QUEUE-V3] Sent to user@example.com
✅ [QUEUE-V3] Processed 1 emails, 0 failures
```

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is not configured"
- ❌ Key not in `.env.local`
- ✅ Add key and restart server

### Still getting 404:
- ❌ Server not restarted after adding key
- ✅ Stop server (Ctrl+C) and run `npm run dev` again

### Error: "Campaign not found or not in sending status"
- ❌ Campaign status check failing
- ✅ This is working correctly! It means the service role is functioning, but your campaign isn't in "sending" status (expected behavior)

## Production Setup

For production (Vercel, etc.):

1. Go to your hosting dashboard
2. Add environment variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your service role key from Supabase
3. Redeploy your app

**Never commit the service role key to git!**

---

## What This Fixes

Before (broken):
```
User → send/route.ts → fetch('/processQueue') → ❌ No auth → RLS blocks → 404
```

After (working):
```
User → send/route.ts → fetch('/processQueue') → ✅ Service role → Bypasses RLS → Sends emails
```

---

**Questions?** Check that:
1. ✅ Key is in `.env.local`
2. ✅ Server was restarted
3. ✅ Key starts with `eyJ`
4. ✅ Copied from "service_role" (not "anon")
