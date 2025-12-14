# Sender Address Setup Guide

## Overview

Joltibase automatically creates a sender address for each user when they sign up. Users send from `username@mail.joltibase.com` and replies go to their actual email address.

## How It Works

1. **User signs up** with `stener88@gmail.com`
2. **System auto-creates** sender address: `stener88@mail.joltibase.com`
3. **User sends campaigns** from `Stener <stener88@mail.joltibase.com>`
4. **Recipients reply** and email goes to `stener88@gmail.com`

## Database Migration

Run the migration to create the `sender_addresses` table:

```bash
# In Supabase Dashboard → SQL Editor:
# Run: supabase/migrations/20250212_sender_addresses.sql
```

Or apply via CLI:
```bash
supabase db push
```

## Environment Variables Required

```bash
# Required for sending emails
RESEND_API_KEY=re_xxxxx

# Required for sender address creation (uses admin client)
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## API Endpoints

### GET /api/sender-addresses
Get user's sender addresses

**Response:**
```json
{
  "success": true,
  "data": {
    "senders": [
      {
        "id": "uuid",
        "email": "stener88@mail.joltibase.com",
        "name": "Stener Hansen",
        "is_default": true,
        "is_verified": true
      }
    ],
    "default": { ... }
  }
}
```

### PATCH /api/sender-addresses
Update sender display name

**Request:**
```json
{
  "senderId": "uuid",
  "name": "New Display Name"
}
```

## Testing

1. **Create a test user:**
```sql
-- In Supabase, sign up via your app
```

2. **Check sender was created:**
```sql
SELECT * FROM sender_addresses;
```

3. **Test sending:**
   - Create a campaign
   - Send to test email
   - Verify FROM shows: `username@mail.joltibase.com`
   - Reply and verify it goes to user's real email

## Upgrade Path: Custom Domains

Later, users can add custom domains for better deliverability:
- Add "Custom Domain Sender" feature
- Integrate Resend Domains API
- Show DNS instructions
- Verify domain
- Allow sending from `hello@theirbrand.com`

## Troubleshooting

**Sender not created on signup?**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Check logs in `/app/auth/callback/route.ts`
- Manually create via API: `GET /api/sender-addresses`

**Emails not sending?**
- Verify `mail.joltibase.com` is verified in Resend
- Check `RESEND_API_KEY` is valid
- Look for errors in campaign send logs

**Reply-to not working?**
- Check user email exists in `auth.users`
- Verify `replyTo` field in `sendEmail()` call

