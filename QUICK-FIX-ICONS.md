# 🎯 QUICK FIX - Icons Not Showing

## Your Campaign: 6a757326-0416-45b6-adeb-12d660980228

### Problem
Social icons showing broken image icons in preview

### Root Cause
Old campaign uses hardcoded `https://yourdomain.com` URLs instead of `[APP_URL]` placeholder

---

## ✅ SOLUTION (Choose One)

### Option 1: Regenerate Campaign (RECOMMENDED)
**Fastest if you don't have custom edits**

1. Go to: http://localhost:3000/dashboard/campaigns/6a757326-0416-45b6-adeb-12d660980228/edit
2. Click "Regenerate" (or trigger new generation in chat)
3. Icons will automatically work! ✅

### Option 2: Manual Find/Replace
**Use if you have edits to preserve**

1. Go to campaign editor
2. Switch to code view (if available)
3. Find: `https://yourdomain.com`
4. Replace with: `[APP_URL]`
5. Save

---

## ✅ VERIFICATION

After regenerating, you should see:
- Icons visible in preview
- Inspect element shows: `http://localhost:3000/email-assets/icons/twitter.png`

---

## 🎉 What's Fixed

All of these now work automatically:
- ✅ Design system templates use `[APP_URL]` placeholder
- ✅ Renderer replaces `[APP_URL]` with actual domain
- ✅ AI knows to use `[APP_URL]` in generated emails
- ✅ Works in dev (`localhost:3000`) and production (`yourdomain.com`)

**All future campaigns will automatically have working icons!**

---

## 📚 Full Documentation

- `ICON-PLACEHOLDER-FIX-COMPLETE.md` - Complete fix summary
- `docs/APP-URL-PLACEHOLDER.md` - Technical deep dive
- `docs/EMAIL-ICONS.md` - Icon setup guide

---

**Next:** Just regenerate your campaign and icons will work! 🚀

