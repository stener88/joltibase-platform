# 🚀 Pre-Launch Checklist

## ✅ **Critical (MUST DO Before Launch)**

### 1. Environment Variables & Configuration

#### Production Environment Variables (Vercel)
- [ ] **App URL** - Set `NEXT_PUBLIC_APP_URL` to production domain
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
  - **Critical:** Update in Vercel Dashboard

- [ ] **Supabase**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **AI Providers**
  - [ ] `ANTHROPIC_API_KEY` (if using Claude)
  - [ ] `GOOGLE_GENERATIVE_AI_API_KEY` (Gemini 3 Flash)
  - [ ] `GEMINI_API_KEY` (same as above)
  - [ ] Verify current model: `gemini-3-flash-preview`

- [ ] **Email Service (Resend)**
  - [ ] `RESEND_API_KEY`
  - [ ] Verify domain DNS records
  - [ ] Test email sending in production

- [ ] **Sentry**
  - [ ] `SENTRY_DSN`
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - [ ] `SENTRY_ORG=joltibase`
  - [ ] `SENTRY_PROJECT=joltibase`
  - [ ] `SENTRY_AUTH_TOKEN`
  - [ ] Test error reporting

- [ ] **Redis (Optional - for rate limiting)**
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`

---

### 2. Database (Supabase)

#### Migrations
- [ ] **Apply security migration** - `20250219_fix_function_search_paths.sql`
  - Copy contents to Supabase SQL Editor
  - Run and verify no errors
  - Check Database → Lint (should show fewer warnings)

#### Verify Table Structure
- [ ] `campaigns_v3` exists and has correct columns
- [ ] `sender_addresses` exists
- [ ] `brand_kits` exists
- [ ] `profiles` table exists (for auth)
- [ ] `emails` table exists (for sending)
- [ ] `contacts` and `lists` tables exist

#### Row Level Security (RLS)
- [ ] Test: Create campaign as User A
- [ ] Test: User B cannot see User A's campaigns
- [ ] Test: Users can only modify their own data
- [ ] Test: Signup creates profile correctly

#### Clean Up
- [ ] Delete test campaigns
- [ ] Delete test contacts
- [ ] Remove any dev/staging data
- [ ] **Backup database before launch!**

---

### 3. Security

#### Supabase Security
- [ ] All RLS policies enabled on user tables
- [ ] Service role key is SECRET (not in frontend)
- [ ] Auth email confirmation enabled/disabled (decide)
- [ ] Password requirements configured
- [ ] Rate limiting enabled (if using Redis)

#### Auth Testing
- [ ] Sign up flow works
- [ ] Email verification works (if enabled)
- [ ] Login works
- [ ] Password reset works
- [ ] OAuth providers work (if configured)
- [ ] Session persistence works
- [ ] Logout works

#### API Security
- [ ] All API routes check authentication
- [ ] No sensitive data in console logs
- [ ] API rate limiting tested
- [ ] CORS configured correctly

---

### 4. Core Features Testing

#### Email Generation
- [ ] Simple prompt generates email
- [ ] Complex prompt generates email
- [ ] Generation cost logs accurately
- [ ] Images resolve correctly
- [ ] Preview renders properly
- [ ] Export HTML works
- [ ] No console errors

#### Email Refinement
- [ ] Chat interface works
- [ ] "Change color to blue" works
- [ ] "Make it shorter" works
- [ ] "Add more sections" works
- [ ] Toolbar commands work (delete, edit, etc.)
- [ ] Live preview updates

#### Email Sending
- [ ] Select contact list
- [ ] Choose sender address
- [ ] Send test email
- [ ] Emails arrive in inbox
- [ ] Unsubscribe link works
- [ ] Analytics tracking works

#### Analytics Dashboard
- [ ] No SQL errors
- [ ] Polling works (every 10s, not 260ms!)
- [ ] Charts render
- [ ] Real-time feed works
- [ ] Export functionality works

---

### 5. Performance

#### Load Testing
- [ ] Homepage loads < 2s
- [ ] Dashboard loads < 3s
- [ ] Generation completes < 15s
- [ ] API endpoints respond < 500ms
- [ ] No memory leaks during generation

#### Production Build
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size reasonable

---

### 6. Monitoring & Logging

#### Sentry
- [ ] Errors are captured
- [ ] Source maps uploaded
- [ ] Test error in production
- [ ] Check Sentry dashboard
- [ ] Set up alerts (optional)

#### Cost Tracking
- [ ] Generation costs logged accurately
- [ ] Console shows: `💰 [COST] $0.012`
- [ ] Gemini 3 Flash pricing correct ($0.50/$3.00)

#### Analytics
- [ ] Track page views (optional)
- [ ] Track email generations
- [ ] Track email sends
- [ ] Monitor API usage

---

## ⚠️ **Important (Should Do)**

### 7. User Experience

#### Error Messages
- [ ] Friendly validation errors (not raw Zod)
- [ ] Clear error states
- [ ] Helpful 404 page
- [ ] Helpful 500 page

#### Edge Cases
- [ ] Empty campaign list
- [ ] No contacts
- [ ] Failed generation (API down)
- [ ] Network error handling
- [ ] Slow connection behavior

#### Mobile Testing
- [ ] Homepage responsive
- [ ] Dashboard usable on mobile
- [ ] Email preview works
- [ ] Editor usable (or disabled with message)

---

### 8. Content & Messaging

#### Landing Page
- [ ] Clear value proposition
- [ ] Example emails shown
- [ ] Pricing information
- [ ] CTA buttons work
- [ ] Links to docs/support

#### Email Templates
- [ ] Welcome email template
- [ ] Password reset email
- [ ] Email verification (if used)
- [ ] Unsubscribe confirmation

#### Legal
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie policy (if tracking)
- [ ] GDPR compliance (if EU users)
- [ ] CAN-SPAM compliance

---

### 9. Documentation

#### User Docs
- [ ] How to create first email
- [ ] How to send emails
- [ ] How to manage contacts
- [ ] FAQ section

#### Technical Docs
- [ ] API rate limits documented
- [ ] Cost structure clear
- [ ] Image guidelines
- [ ] Email best practices

---

## 🎯 **Nice to Have (Can Wait)**

### 10. Polish

#### UI Improvements
- [ ] Replace placeholder icons
- [ ] Add loading skeletons
- [ ] Improve empty states
- [ ] Add animations/transitions
- [ ] Delete test pages (`/test-icons`, `/sentry-example`)

#### Feature Enhancements
- [ ] Countdown timers (post-launch)
- [ ] MJML support (post-launch)
- [ ] Usage tracking/limits (post-launch)
- [ ] Improved icon system (post-launch)

---

### 11. SEO & Marketing

#### SEO Basics
- [ ] Page titles optimized
- [ ] Meta descriptions added
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Sitemap.xml
- [ ] Robots.txt

#### Social Proof
- [ ] Example emails showcase
- [ ] Testimonials (if any)
- [ ] Case studies (if any)
- [ ] Social media links

---

### 12. Business Setup

#### Payment Processing (If Launching Paid)
- [ ] Stripe/payment provider integrated
- [ ] Pricing tiers configured
- [ ] Subscription management
- [ ] Billing portal

#### Support
- [ ] Support email configured
- [ ] Help documentation
- [ ] Feedback mechanism
- [ ] Bug reporting process

---

## 🚢 **Deployment Steps**

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel login
   vercel
   ```

2. **Configure Domain**
   - [ ] Add custom domain in Vercel
   - [ ] Update DNS records
   - [ ] Wait for SSL (automatic)
   - [ ] Update `NEXT_PUBLIC_APP_URL` env var

3. **Deploy**
   ```bash
   git push origin main  # Auto-deploys to Vercel
   ```

4. **Verify**
   - [ ] Visit production URL
   - [ ] Test complete user flow
   - [ ] Check Sentry for errors
   - [ ] Monitor logs

---

## ✅ **Final Checks**

### Pre-Launch Review
- [ ] All critical items checked
- [ ] Database backed up
- [ ] Environment variables set
- [ ] Security tested
- [ ] Core features work
- [ ] Monitoring active

### Launch Day
- [ ] Announce on social media
- [ ] Monitor error logs closely
- [ ] Watch for performance issues
- [ ] Respond to user feedback quickly
- [ ] Celebrate! 🎉

---

## 📊 **Current Status**

### ✅ Already Complete
- ✅ Auth system (fixed profiles table)
- ✅ Supabase function security (migration ready)
- ✅ Analytics dashboard (SQL + polling fixed)
- ✅ Email generation (Gemini 3 Flash configured)
- ✅ Cost tracking (accurate pricing)
- ✅ Sentry integration
- ✅ Logger utility
- ✅ Frontend validation

### 🚧 Needs Attention
- ⚠️ Apply Supabase security migration
- ⚠️ Set production environment variables
- ⚠️ Configure custom domain
- ⚠️ Test email sending in production
- ⚠️ Clean up test data

### 🔮 Post-Launch
- Countdown timers
- MJML testing
- Usage limits/tracking
- Icon improvements
- Platform cleanup

---

## 🆘 **Troubleshooting**

### If Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### If Emails Don't Send
1. Check Resend API key
2. Verify DNS records for domain
3. Check rate limits
4. Review Sentry errors

### If Database Errors
1. Check RLS policies
2. Verify migration applied
3. Test with service role key
4. Review Supabase logs

---

## 📞 **Support Resources**

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Email Docs:** https://react.email/docs
- **Sentry Docs:** https://docs.sentry.io

---

**Good luck with launch! 🚀**

Remember: Launch first, perfect later. You can always iterate!
