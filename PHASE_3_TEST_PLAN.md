# Phase 3 AI Intelligence - Test Plan

## Test Objective
Verify that the AI intelligently selects templates, typography scales, and spacing based on campaign characteristics.

## Test Cases

### Test 1: Product Launch Announcement
**Prompt:** "Announcing our new AI-powered analytics feature for enterprise customers"

**Expected AI Decisions:**
- Template: `launch-announcement` or `premium-hero`
- Typography Scale: `premium` (major announcement, excitement needed)
- Spacing: `generous` (premium feel, first impression)
- Rationale: Product launch = high impact needed

**What to verify:**
- [ ] AI selects launch-announcement or premium-hero template
- [ ] typographyScale is set to "premium"
- [ ] spacing is set to "generous"
- [ ] Uses stats sections if applicable
- [ ] Bold, exciting copy with clear CTA

---

### Test 2: Weekly Company Newsletter
**Prompt:** "Create a weekly newsletter with company updates and product tips"

**Expected AI Decisions:**
- Template: `newsletter-pro` or `update-digest`
- Typography Scale: `standard` (regular communication)
- Spacing: `standard` (balanced, organized)
- Rationale: Newsletter = organized content delivery

**What to verify:**
- [ ] AI selects newsletter-pro or update-digest template
- [ ] typographyScale is set to "standard"
- [ ] spacing is set to "standard"
- [ ] Multiple sections with dividers
- [ ] Organized, scannable layout

---

### Test 3: Flash Sale - Urgent Promotion
**Prompt:** "Flash sale - 50% off all plans, ends in 24 hours"

**Expected AI Decisions:**
- Template: `promo-bold`
- Typography Scale: `premium` (urgency, maximum attention)
- Spacing: `generous` (bold, impactful)
- Rationale: Limited-time sale = urgency needed

**What to verify:**
- [ ] AI selects promo-bold template
- [ ] typographyScale is set to "premium"
- [ ] spacing is set to "generous"
- [ ] Urgent language and deadline messaging
- [ ] Stats or comparison sections showing savings
- [ ] Bold, eye-catching CTA

---

### Test 4: Welcome New Users
**Prompt:** "Welcome email for new signups to help them get started"

**Expected AI Decisions:**
- Template: `welcome-warmth`
- Typography Scale: `standard` (friendly, approachable)
- Spacing: `generous` (welcoming, not overwhelming)
- Rationale: First touchpoint = warm and helpful

**What to verify:**
- [ ] AI selects welcome-warmth template
- [ ] typographyScale is set to "standard"
- [ ] spacing is set to "generous"
- [ ] Warm, friendly greeting
- [ ] Clear next steps or onboarding guidance
- [ ] Testimonial for social proof

---

### Test 5: Quarterly Report to Investors
**Prompt:** "CEO letter sharing Q4 results and vision for next year with investors"

**Expected AI Decisions:**
- Template: `text-luxury` or `minimal-accent`
- Typography Scale: `minimal` (sophisticated, editorial)
- Spacing: `generous` (refined, spacious)
- Rationale: Editorial content = refined presentation

**What to verify:**
- [ ] AI selects text-luxury or minimal-accent template
- [ ] typographyScale is set to "minimal"
- [ ] spacing is set to "generous"
- [ ] Professional, thoughtful copy
- [ ] Longer text sections with good flow
- [ ] Minimal use of flashy elements

---

## Success Criteria

**Pass if:**
- 4 out of 5 tests select the correct template category
- 4 out of 5 tests select the appropriate typography scale
- 4 out of 5 tests select the appropriate spacing
- All tests include proper design parameters in response

**Fail if:**
- AI consistently selects wrong templates for campaign type
- AI doesn't include typographyScale or spacing in design object
- Validation errors occur

## Test Results

### Test 1: Product Launch
- **Status:** PENDING
- **Template:** 
- **Typography:** 
- **Spacing:** 
- **Pass/Fail:** 

### Test 2: Newsletter
- **Status:** PENDING
- **Template:** 
- **Typography:** 
- **Spacing:** 
- **Pass/Fail:** 

### Test 3: Flash Sale
- **Status:** PENDING
- **Template:** 
- **Typography:** 
- **Spacing:** 
- **Pass/Fail:** 

### Test 4: Welcome Email
- **Status:** PENDING
- **Template:** 
- **Typography:** 
- **Spacing:** 
- **Pass/Fail:** 

### Test 5: CEO Letter
- **Status:** PENDING
- **Template:** 
- **Typography:** 
- **Spacing:** 
- **Pass/Fail:** 

---

## How to Run Tests

1. Start the development server: `npm run dev`
2. Navigate to `/dashboard/campaigns/generate`
3. For each test case, enter the prompt
4. Generate the campaign
5. Inspect the generated campaign's design object
6. Verify template, typographyScale, and spacing match expectations
7. Update test results above

## Notes

- The AI has been trained with 17 templates and intelligent selection rules
- Typography scales: premium (70px), standard (56px), minimal (44px)
- Spacing: generous (80px), standard (60px), compact (48px)
- The AI should analyze campaign characteristics and make appropriate choices

