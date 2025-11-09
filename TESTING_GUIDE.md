# AI Campaign System - Testing Guide

This guide covers testing the improvements made to the AI campaign generation system.

## Overview of Changes

### 1. **Surgical Refinement** - Fixed over-changing behavior
- AI now only changes what the user explicitly requests
- Strict validation rules prevent unwanted modifications

### 2. **Flexible Content Structure** - Reduced rigidity
- New section types: hero, feature-grid, testimonial, stats, comparison, cta-block
- AI can create more varied and engaging email layouts
- Templates render all section types with email-safe HTML

### 3. **Improved Prompt** - Better AI guidance
- Removed wasteful HTML examples (~30% token savings)
- Focus on content strategy instead of HTML generation
- Clear section type documentation

---

## Test 1: Surgical Refinement

**Goal:** Verify that refinement only changes what's requested

### Test Cases:

#### Test 1.1: Change Company Name Only
**Input:** "Change company name to Acme Corp"
**Expected:**
- ✅ Company name changed to "Acme Corp" everywhere
- ✅ Subject line unchanged
- ✅ Body copy unchanged
- ✅ Colors unchanged
- ✅ CTA text unchanged
- ✅ Spacing/styles unchanged

#### Test 1.2: Change CTA Button Color
**Input:** "Make the CTA button blue"
**Expected:**
- ✅ CTA button background color changed to blue
- ✅ CTA text unchanged
- ✅ All other content unchanged
- ✅ Other colors unchanged

#### Test 1.3: Add P.S. Line
**Input:** "Add a P.S. that says 'Reply if you have questions'"
**Expected:**
- ✅ P.S. line added before footer
- ✅ Exact text used
- ✅ Rest of email unchanged
- ✅ No other additions or improvements

#### Test 1.4: Change Subject Line
**Input:** "Make the subject line 'Welcome to Our Platform'"
**Expected:**
- ✅ Subject line changed exactly
- ✅ Preview text unchanged
- ✅ Email body unchanged
- ✅ No rewriting of content

### How to Test:

```bash
# 1. Generate a campaign
# 2. Note the current values (subject, CTA, colors, content)
# 3. Request a specific change via refinement
# 4. Compare before/after - ONLY requested item should change
# 5. If multiple changes occurred, refinement is broken
```

---

## Test 2: Flexible Section Types

**Goal:** Verify AI can use new section types to create varied emails

### Test Cases:

#### Test 2.1: Welcome Email with Feature Grid
**Prompt:** "Create a welcome email for a project management tool showcasing 3 key features"
**Expected sections:**
- text (greeting)
- feature-grid (3 features with icons)
- testimonial (optional)
- cta-block

#### Test 2.2: Promotional Email with Stats
**Prompt:** "Create a promotional email highlighting our user growth and performance"
**Expected sections:**
- hero (bold headline)
- stats (impressive numbers)
- comparison (before/after)
- cta-block

#### Test 2.3: Announcement with Testimonial
**Prompt:** "Announce our new feature with customer feedback"
**Expected sections:**
- text (announcement)
- testimonial (customer quote)
- list (feature details)
- cta-block

### Validation:

Check generated JSON includes:
```json
{
  "emails": [{
    "sections": [
      { "type": "hero", "headline": "...", "subheadline": "..." },
      { "type": "feature-grid", "features": [...] },
      { "type": "testimonial", "testimonial": {...} },
      { "type": "stats", "stats": [...] },
      { "type": "comparison", "comparison": {...} },
      { "type": "cta-block", "ctaText": "...", "ctaUrl": "..." }
    ]
  }]
}
```

---

## Test 3: Template Rendering

**Goal:** Verify all templates render all section types correctly

### Test Cases:

#### Test 3.1: Render All Section Types in Each Template
For each template (gradient-hero, color-blocks, bold-modern, minimal-accent, text-first):

1. Create email with ALL section types
2. Render HTML
3. Validate:
   - ✅ All sections present in output
   - ✅ Email-safe HTML (tables, inline CSS)
   - ✅ No broken layouts
   - ✅ Responsive (max-width: 600px)
   - ✅ Accessible (high contrast, alt text)

#### Test 3.2: Email Client Compatibility
Test rendered HTML in:
- Gmail
- Outlook (desktop)
- Apple Mail
- Mobile (iOS, Android)

Expected:
- ✅ Layout intact across all clients
- ✅ Colors display correctly
- ✅ CTA buttons clickable
- ✅ No horizontal scrolling on mobile

---

## Test 4: Token Efficiency

**Goal:** Verify token savings from prompt improvements

### Measurement:

```bash
# Before (old prompt with HTML examples): ~2500 tokens
# After (new prompt without HTML): ~1750 tokens
# Savings: ~30%
```

**Test:** Generate 5 campaigns and average token usage
**Expected:** Prompt tokens should be 25-30% lower than before

---

## Test 5: End-to-End Flow

**Goal:** Verify complete campaign generation and refinement flow

### Steps:

1. **Generate** campaign
   ```
   Prompt: "Welcome series for SaaS project management tool"
   ```

2. **Validate** output has:
   - ✅ strategy (goal, keyMessage)
   - ✅ design (template, colors)
   - ✅ emails array with sections (not htmlBody)
   - ✅ Varied section types used

3. **Render** templates
   - ✅ HTML generated for all emails
   - ✅ Plain text generated
   - ✅ All sections rendered

4. **Refine** campaign
   ```
   Request: "Change CTA to 'Start Free Trial'"
   ```

5. **Validate** refinement:
   - ✅ Only CTA text changed
   - ✅ Everything else preserved

6. **Preview** in browser
   - ✅ Email looks good
   - ✅ Mobile responsive
   - ✅ CTA button works

---

## Success Criteria

### Refinement:
- [ ] Surgical changes work (10/10 tests pass)
- [ ] No over-changing observed
- [ ] Users report predictable behavior

### Flexibility:
- [ ] All 6 new section types used by AI
- [ ] Emails more varied and engaging
- [ ] Templates render all sections correctly

### Performance:
- [ ] 25-30% token reduction confirmed
- [ ] Generation time improved
- [ ] Cost per campaign reduced

### Quality:
- [ ] Tone remains excellent
- [ ] Email deliverability maintained
- [ ] No visual regressions
- [ ] Accessible and responsive

---

## Regression Tests

Ensure existing functionality still works:

1. **Legacy campaigns** still load and render
2. **Brand colors** applied correctly
3. **Merge tags** work ({{first_name}}, {{company_name}}, etc.)
4. **Email validation** still enforces rules
5. **Database** saves campaigns correctly

---

## Manual Testing Checklist

- [ ] Generate 5 different campaign types
- [ ] Use all 5 templates
- [ ] Test surgical refinement (10 scenarios)
- [ ] Test each new section type
- [ ] Preview in 4+ email clients
- [ ] Check mobile responsiveness
- [ ] Verify token usage reduction
- [ ] Test edge cases (long content, many sections)
- [ ] Check accessibility (screen reader, contrast)
- [ ] Validate HTML (W3C, email validators)

---

## Known Limitations

1. **No visual editor** - sections are code-based
2. **Limited layout control** - templates determine visual structure
3. **No custom section types** - fixed set of 11 types
4. **AI may still hallucinate** - validation catches most issues

---

## Next Steps

After testing:

1. Monitor AI generation logs for issues
2. Collect user feedback on flexibility
3. Track refinement accuracy metrics
4. Measure engagement improvements
5. Consider adding more section types based on usage

