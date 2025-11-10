# Quick Start Context for New Chat

**Use this file to quickly onboard a new AI assistant to the rotGO/Joltibase project.**

---

## 🎯 Project Overview

**rotGO** = AI-powered email marketing platform that beats Flodesk by combining AI generation with visual editing.

**Goal:** AI analyzes prompts → generates perfect block-based emails with exact pixel values → users visually edit

**Repository:** https://github.com/stener88/joltibase-platform  
**Main Branch:** `main` (all code committed)  
**Worktree:** `/Users/stenerhansen/.cursor/worktrees/joltibase-platform/rotGO`  

---

## ✅ What's Complete (Phases 1-4B)

### Phase 4B: AI Block Generation (CURRENT STATE)
**Status:** ✅ Complete, committed, all tests passing

**What Works:**
- AI analyzes campaign prompts (8 campaign types)
- Selects typography scale (premium: 70px, standard: 56px, minimal: 44px)
- Selects spacing scale (generous/standard/compact)
- Generates 14 block types with exact pixel values
- Renders email-safe HTML (table-based, inline CSS)
- Stores blocks in database (campaigns.blocks, campaigns.design_config)
- Backward compatible with legacy section-based emails

**Key Files:**
- `lib/ai/blocks/intelligence.ts` (470 lines) - Campaign analysis
- `lib/ai/blocks/templates.ts` (670 lines) - 4 pre-built templates
- `lib/ai/prompts.ts` (+415 lines) - Block generation instructions
- `lib/ai/validator.ts` - Block schemas & type guards
- `lib/ai/generator.ts` - Hybrid rendering
- `lib/email/blocks/` - 14 block types (Phase 4A)

**Tests:** All passing ✅
```bash
npx tsx scripts/test-block-system.ts
npx tsx scripts/test-ai-block-generation.ts
```

---

## 🚀 Next Phase: 4C - Visual Editor UI

**Goal:** Build visual editor for click-to-edit blocks

**Components Needed:**
1. EmailCanvas - Visual preview with hover/select
2. BlockPalette - Sidebar with 14 block types
3. BlockSettings - Edit block properties dynamically
4. LivePreview - Desktop/mobile toggle
5. BlockToolbar - Move/duplicate/delete blocks
6. AIRefinePanel - Conversational editing

**Files to Create:** `components/email-editor/*.tsx`

---

## 🏗️ System Architecture

### AI Flow
```
User Prompt → AI Intelligence → Generate Blocks → Validate (Zod) → Render HTML → Store DB
```

### 14 Block Types
Logo, Spacer, Heading, Text, Image, Button, Divider, Hero, Stats, Testimonial, FeatureGrid, Comparison, SocialLinks, Footer

### Database Schema
```sql
campaigns (
  blocks jsonb,           -- Array of EmailBlock objects
  design_config jsonb     -- GlobalEmailSettings
)

block_templates (
  blocks jsonb,           -- Reusable patterns
  category text
)
```

---

## 🔑 Key Technical Decisions

### Exact Pixel Values (Not Scale Names)
- ✅ `fontSize: '70px'` (not 'h1')
- ✅ `padding: { top: 40, bottom: 40 }` (not 'generous')
- ✅ `color: '#111827'` (exact hex)

**Why:** Enables AI to learn "70px headlines convert 23% better for launches"

### Typography Scales
- **Premium:** 70px headlines, 100px stats (major launches)
- **Standard:** 56px headlines, 80px stats (most campaigns)
- **Minimal:** 44px headlines, 64px stats (editorial)

### Spacing Scales
- **Generous:** 80px hero padding, 60px sections
- **Standard:** 60px hero padding, 40px sections
- **Compact:** 40px hero padding, 20px sections

### Email Safety
- Table-based HTML (not flexbox/grid)
- Inline CSS only
- Max-width 600px
- Outlook VML for buttons
- No JavaScript

---

## 📂 Important Paths

**AI System:**
- `lib/ai/generator.ts` - Main orchestration
- `lib/ai/prompts.ts` - System prompts (855 lines)
- `lib/ai/validator.ts` - Zod schemas
- `lib/ai/blocks/intelligence.ts` - Campaign analysis
- `lib/ai/blocks/templates.ts` - Block patterns

**Block System:**
- `lib/email/blocks/types.ts` - TypeScript interfaces
- `lib/email/blocks/schemas.ts` - Zod schemas
- `lib/email/blocks/renderer.ts` - HTML rendering
- `lib/email/blocks/index.ts` - Entry point

**Tests:**
- `scripts/test-block-system.ts`
- `scripts/test-ai-block-generation.ts`

**Database:**
- `supabase/phase-4a-block-system-migration.sql`

**Docs:**
- `PROJECT_STATUS.md` - Full detailed status
- `PHASE_4A_COMPLETE.md` - Phase 4A summary
- `PHASE_4B_COMPLETE.md` - Phase 4B summary

---

## ⚠️ Before Testing on Live Platform

1. **Run Database Migration:**
   ```sql
   -- Run in Supabase SQL Editor
   -- File: supabase/phase-4a-block-system-migration.sql
   ```

2. **Install Dependencies:**
   ```bash
   npm install  # Ensure zod is installed
   ```

3. **Verify Environment:**
   - OpenAI API key configured
   - Supabase connection working

---

## 🧪 Quick Test Commands

```bash
# In rotGO worktree
cd /Users/stenerhansen/.cursor/worktrees/joltibase-platform/rotGO

# Test block rendering (14 types)
npx tsx scripts/test-block-system.ts

# Test AI intelligence (5 campaign types)
npx tsx scripts/test-ai-block-generation.ts

# Check git status
cd /Users/stenerhansen/joltibase-platform
git log --oneline -n 5
```

---

## 💡 Key Code Patterns

### Type Guard for Format Detection
```typescript
import { isBlockBasedEmail } from '@/lib/ai/validator';

if (isBlockBasedEmail(email)) {
  // Handle block-based
} else {
  // Handle legacy sections
}
```

### Get Campaign Recommendations
```typescript
import { getCampaignRecommendations } from '@/lib/ai/blocks/intelligence';

const recs = getCampaignRecommendations(prompt, tone);
// Returns: typography, spacing, blockSequence, analysis
```

### Render Blocks to HTML
```typescript
import { renderBlockEmail } from '@/lib/email/blocks/renderer';

const html = renderBlockEmail({
  blocks: [...],
  globalSettings: {...}
});
```

### Validate Blocks
```typescript
import { EmailBlockSchema } from '@/lib/email/blocks/schemas';

const result = EmailBlockSchema.safeParse(blockData);
```

---

## 🎨 Example Block Structure

```json
{
  "type": "hero",
  "content": {
    "headline": "Introducing AI Analytics",
    "subheadline": "Transform data into insights"
  },
  "settings": {
    "padding": { "top": 80, "bottom": 80, "left": 40, "right": 40 },
    "align": "center",
    "backgroundColor": "#f9fafb",
    "headlineFontSize": "70px",
    "headlineFontWeight": 900,
    "headlineColor": "#111827",
    "subheadlineFontSize": "18px",
    "subheadlineColor": "#6b7280"
  },
  "position": 0
}
```

---

## 🚦 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| AI Intelligence | ✅ Complete | Campaign analysis, recommendations |
| Block Types (14) | ✅ Complete | All defined, rendered, validated |
| Block Renderer | ✅ Complete | Email-safe HTML |
| AI Prompts | ✅ Complete | 415 lines of block instructions |
| Validator | ✅ Complete | Zod schemas, type guards |
| Generator | ✅ Complete | Hybrid (blocks + sections) |
| Templates | ✅ Complete | 4 pre-built patterns |
| Database | ⚠️ Migration ready | Need to run SQL |
| Tests | ✅ Passing | 100% (block + AI tests) |
| Visual Editor | ❌ Not started | Phase 4C next |

---

## 📝 Common Questions

**Q: Can I test block generation on the platform?**  
A: Need to run database migration first, then deploy code.

**Q: Are old section-based emails still supported?**  
A: Yes! Backward compatible. Generator detects format with type guards.

**Q: How does AI decide typography/spacing?**  
A: `analyzeCampaign()` detects campaign type, urgency, importance → selects scale.

**Q: What's the difference between blocks and sections?**  
A: Blocks = granular (exact pixels, editable), Sections = template-based (fixed).

**Q: Where are blocks stored?**  
A: `campaigns.blocks` (jsonb array) + `campaigns.design_config` (jsonb object).

---

## 🎯 Ready to Continue?

**For Phase 4C (Visual Editor):**
- Start with `components/email-editor/EmailCanvas.tsx`
- Reference `lib/email/blocks/types.ts` for block structure
- Use `lib/email/blocks/renderer.ts` for preview rendering
- Follow Phase 4C plan in `PROJECT_STATUS.md`

**For Testing:**
- Run database migration
- Deploy code
- Generate a campaign
- Check logs for: `"📦 [GENERATOR] Campaign format: blocks"`

**For Bug Fixes:**
- Check `lib/ai/generator.ts` for rendering logic
- Check `lib/email/blocks/renderer.ts` for HTML issues
- Check `lib/ai/blocks/intelligence.ts` for recommendation logic

---

**Last Updated:** November 10, 2025  
**All Code:** Committed to `main` branch ✅  
**All Tests:** Passing 100% ✅  
**Ready For:** Phase 4C - Visual Editor UI 🚀


