# Email Asset Icons - Self-Hosted PNG Solution

## Overview

Social media icons for emails are now **self-hosted PNG files** for maximum email client compatibility.

**Why PNG instead of CDN/SVG?**
- ✅ **Gmail**: Trusts your domain, blocks external CDNs
- ✅ **Outlook**: Strips SVG entirely, PNG works perfectly
- ✅ **Apple Mail, Yahoo, ProtonMail**: PNG works everywhere
- ✅ **Control**: Full ownership of icons, no external dependencies
- ✅ **Performance**: Hosted on your fast CDN (Vercel/Cloudflare)

---

## 📂 Directory Structure

```
public/email-assets/icons/
├── twitter.png      ✅ Hosted
├── facebook.png     ✅ Hosted
├── instagram.png    ✅ Hosted
├── linkedin.png     ✅ Hosted
├── tiktok.png       ✅ Hosted
└── youtube.png      (add if needed)
```

**Icon Specs:**
- **Format**: PNG (not SVG!)
- **Size**: 48x48 pixels (displayed at 24x24 for retina)
- **Optimization**: Run through TinyPNG/ImageOptim for smaller file size

---

## 🔧 Configuration

### 1. Environment Variable

Add to `.env.local`:

```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (update when deployed)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important**: Update this to your production domain before deploying!

### 2. Icon URLs

Icons are automatically accessible at:

```
Development:  http://localhost:3000/email-assets/icons/twitter.png
Production:   https://yourdomain.com/email-assets/icons/twitter.png
```

---

## 📧 Email Usage

### Basic Usage

```tsx
import { Img, Link } from '@react-email/components';

<Link href="https://twitter.com/yourhandle">
  <Img
    src="https://yourdomain.com/email-assets/icons/twitter.png"
    width="24"
    height="24"
    alt="Twitter"
    style={{ width: '24px', height: '24px' }}
  />
</Link>
```

### Using Helper Functions

```tsx
import { SOCIAL_ICONS, getIconUrl } from '@/emails/lib/social-icons';

// Get icon URL
const twitterUrl = SOCIAL_ICONS.twitter.url;
// or
const twitterUrl = getIconUrl('twitter');
```

### Standard Footer Pattern

```tsx
<Section className="mt-8">
  <Row>
    <Column align="center">
      <Text className="mb-4 text-center text-sm font-semibold text-gray-700">
        Follow us:
      </Text>
      <Row className="inline-flex">
        <Column className="px-2">
          <Link href="https://twitter.com/yourhandle">
            <Img
              src="https://yourdomain.com/email-assets/icons/twitter.png"
              width="24"
              height="24"
              alt="Twitter"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="https://facebook.com/yourpage">
            <Img
              src="https://yourdomain.com/email-assets/icons/facebook.png"
              width="24"
              height="24"
              alt="Facebook"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="https://instagram.com/yourprofile">
            <Img
              src="https://yourdomain.com/email-assets/icons/instagram.png"
              width="24"
              height="24"
              alt="Instagram"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
      </Row>
    </Column>
  </Row>
</Section>
```

---

## 🧪 Testing

### Test Page

Visit: **http://localhost:3000/test-icons**

This page shows:
- All available icons
- Correct URLs
- Visual preview
- Copy-paste code snippets

### Email Client Testing

Before sending to real users, test in:

1. **Gmail** (web + mobile)
2. **Apple Mail** (macOS + iOS)
3. **Outlook** (web, desktop, mobile)
4. **Yahoo Mail**
5. **ProtonMail**

**Expected Result**: Icons should load instantly in ALL clients.

---

## 🚀 Adding More Icons

### 1. Download PNG Icon

Go to [SimpleIcons.org](https://simpleicons.org):
1. Search for platform (e.g., "YouTube")
2. Click icon
3. Download as PNG (48x48 or 24x24, we recommend 48x48)
4. Save as `platform-name.png` (lowercase, no spaces)

### 2. Add to Project

```bash
cp ~/Downloads/youtube-icon.png public/email-assets/icons/youtube.png
```

### 3. Update Configuration

Add to `emails/lib/social-icons.ts`:

```typescript
export const SOCIAL_ICONS: Record<string, SocialIcon> = {
  // ... existing icons
  youtube: {
    name: 'YouTube',
    url: `${getBaseUrl()}/email-assets/icons/youtube.png`,
    color: 'FF0000',
    alt: 'YouTube'
  }
};
```

### 4. Verify

Visit http://localhost:3000/test-icons to confirm it loads.

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] All icons are in `public/email-assets/icons/`
- [ ] Icons are optimized (run through TinyPNG)
- [ ] `.env.local` has `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- [ ] Test page loads all icons correctly
- [ ] Send test email to yourself in Gmail/Outlook
- [ ] Verify icons load in test email

---

## 🔄 Migration Notes

**What Changed:**
- ❌ **Before**: Used `https://cdn.simpleicons.org/...` (external CDN, blocked by Gmail)
- ✅ **After**: Use `https://yourdomain.com/email-assets/icons/...` (self-hosted PNG)

**Files Updated:**
- `emails/lib/social-icons.ts` - Icon URLs now point to self-hosted PNGs
- `emails/design-systems/*.ts` - All templates updated to use PNG icons
- `lib/email-v3/generator.ts` - AI instructions updated for PNG format

**No Breaking Changes**: Existing campaigns work as-is. New campaigns will use self-hosted icons.

---

## 🐛 Troubleshooting

### Icons Don't Load in Development

**Problem**: Icons show broken image icon in test page or emails.

**Solution**:
1. Verify files exist: `ls public/email-assets/icons/`
2. Check `.env.local` has `NEXT_PUBLIC_APP_URL=http://localhost:3000`
3. Restart dev server: `npm run dev`
4. Clear browser cache

### Icons Don't Load in Production Email

**Problem**: Icons load on website but not in email.

**Solution**:
1. Check `NEXT_PUBLIC_APP_URL` is set to production domain (not localhost!)
2. Verify icons are deployed (visit `https://yourdomain.com/email-assets/icons/twitter.png` in browser)
3. Check Vercel build logs for errors
4. Test email HTML source - icon URLs should be `https://yourdomain.com/...` (not localhost)

### Icons Load Slowly in Email

**Problem**: Icons take 2-3 seconds to appear.

**Solution**:
1. Optimize PNGs: Run through [TinyPNG.com](https://tinypng.com)
2. Verify Vercel/Cloudflare CDN is enabled
3. Check icon file sizes (should be <10KB each)

---

## 📚 Resources

- [React Email Docs](https://react.email)
- [SimpleIcons.org](https://simpleicons.org) - Download more icons
- [TinyPNG](https://tinypng.com) - Optimize PNG file sizes
- [Email on Acid](https://www.emailonacid.com/blog/article/email-development/best-practices-for-email-images/) - Image best practices

---

## ✅ Quick Reference

**Icon Requirements:**
- Format: PNG (48x48 displayed at 24x24)
- Location: `public/email-assets/icons/`
- URL: `https://yourdomain.com/email-assets/icons/{platform}.png`
- Size: MUST specify `width="24" height="24"` AND inline style

**Available Icons:**
- Twitter/X
- Facebook
- Instagram
- LinkedIn
- TikTok
- (Add more as needed)

**Test URL:** http://localhost:3000/test-icons

