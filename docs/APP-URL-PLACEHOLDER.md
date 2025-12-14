# [APP_URL] Placeholder System

## Overview

The `[APP_URL]` placeholder is used throughout email templates to ensure asset URLs work in all environments (development, staging, production) without hardcoding domains.

## How It Works

### 1. **In Templates** (Design Systems, AI-generated emails)
Use the `[APP_URL]` placeholder for all self-hosted assets:

```tsx
// ✅ CORRECT - Use placeholder
<Img src="[APP_URL]/email-assets/icons/twitter.png" ... />

// ❌ WRONG - Don't hardcode domain
<Img src="http://localhost:3000/email-assets/icons/twitter.png" ... />
<Img src="https://yourdomain.com/email-assets/icons/twitter.png" ... />
```

### 2. **At Render Time** (Automatic replacement)
The renderer (`lib/email-v3/renderer.ts`) automatically replaces `[APP_URL]` with the actual base URL:

```typescript
// In renderer.ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const finalHtml = html.replace(/\[APP_URL\]/g, baseUrl);
```

### 3. **Result**
- **Development**: `[APP_URL]` → `http://localhost:3000`
- **Production**: `[APP_URL]` → `https://yourdomain.com`

---

## Configuration

### Environment Variable

Set `NEXT_PUBLIC_APP_URL` in your environment:

```bash
# .env.local (development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (Vercel/deployment)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

If not set, defaults to `http://localhost:3000`.

---

## Usage Examples

### Social Media Icons
```tsx
<Img 
  src="[APP_URL]/email-assets/icons/twitter.png" 
  width="24" 
  height="24" 
  alt="Twitter" 
/>
```

### Logo/Brand Assets
```tsx
<Img 
  src="[APP_URL]/email-assets/logo.png" 
  width="120" 
  alt="Company Logo" 
/>
```

### Custom Images
```tsx
<Img 
  src="[APP_URL]/email-assets/banners/promo.png" 
  width="600" 
  alt="Promotion Banner" 
/>
```

---

## Why Use Placeholders?

### ❌ **Problem with Hardcoded URLs**
```tsx
// Development works, production breaks
<Img src="http://localhost:3000/icons/twitter.png" />

// Production works, development breaks
<Img src="https://yourdomain.com/icons/twitter.png" />
```

### ✅ **Solution with Placeholders**
```tsx
// Works everywhere!
<Img src="[APP_URL]/icons/twitter.png" />
```

**Benefits:**
- Same template works in all environments
- No manual find/replace when deploying
- Easier testing (localhost URLs work)
- No accidental production URLs in dev

---

## What Gets Replaced?

The placeholder system replaces `[APP_URL]` in:
- ✅ Email HTML output (after rendering)
- ✅ Plain text email versions
- ✅ All `<Img src="...">` attributes
- ✅ Any hardcoded URLs in templates

**Note:** Replacement happens at **render time**, not generation time. This means:
- Stored TSX code in database still has `[APP_URL]`
- Only final HTML sent to users has actual URLs
- Re-rendering same campaign works in different environments

---

## AI Generator Integration

The AI is instructed to use `[APP_URL]` in the system prompt:

```typescript
// In lib/email-v3/generator.ts
⚠️ CRITICAL: Always use [APP_URL] placeholder
- [APP_URL] gets replaced with http://localhost:3000 in dev or production domain
- NEVER use hardcoded domains like https://yourdomain.com or http://localhost:3000
```

This ensures all AI-generated emails automatically work in any environment.

---

## Testing

### Verify Replacement Works

1. **Generate a campaign** with social icons
2. **Check database**: TSX code should contain `[APP_URL]`
3. **Render campaign**: HTML should contain `http://localhost:3000` (or production URL)
4. **Send test email**: Icons should load correctly

### Manual Test
```bash
# In lib/email-v3/renderer.ts, add logging:
console.log('Before replacement:', html.substring(0, 500));
console.log('Base URL:', baseUrl);
console.log('After replacement:', finalHtml.substring(0, 500));
```

---

## Troubleshooting

### Icons Don't Show in Preview
**Cause**: Old campaigns generated with hardcoded `https://yourdomain.com`
**Fix**: Regenerate the campaign (will use new `[APP_URL]` placeholder)

### Icons Show `[APP_URL]` Literally
**Cause**: Renderer not replacing placeholder
**Fix**: Check `NEXT_PUBLIC_APP_URL` is set and restart dev server

### Icons Don't Load in Production
**Cause**: `NEXT_PUBLIC_APP_URL` not set to production domain
**Fix**: Set environment variable in Vercel/hosting: `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

---

## Files Using [APP_URL]

### Templates (Design Systems)
- `emails/design-systems/newsletter.ts`
- `emails/design-systems/saas-product-update.ts`
- `emails/design-systems/product-hunt-launch.ts`
- All other design system files

### Configuration
- `emails/lib/social-icons.ts` (uses `getBaseUrl()` for runtime URLs)

### Renderer
- `lib/email-v3/renderer.ts` (performs replacement)

### AI Instructions
- `lib/email-v3/generator.ts` (tells AI to use placeholder)

---

## Production Deployment Checklist

Before deploying:
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Verify placeholder replacement works locally
- [ ] Test email with icons
- [ ] Confirm icons load in Gmail/Outlook
- [ ] Check all asset URLs use HTTPS (if production uses HTTPS)

---

**✅ With the `[APP_URL]` placeholder system, your emails work seamlessly across all environments!**
