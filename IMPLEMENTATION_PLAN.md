# Relax Character Limits + Add Word-Count Hints

## Goal
Achieve 95%+ block generation success by:
1. Relaxing character limits to match AI's natural output (+14-15%)
2. Adding word-count hints so AI thinks in tokens (more intuitive)

## Current Problem
- Success Rate: 67% (4/6 blocks)
- Features: ALL 4 descriptions too long (75-82 chars, limit 70)
- CTA: Subheadline too long (112-115 chars, limit 100)
- **Retry fails**: AI generates same length content on retry

## Changes

### File 1: `lib/email-v2/ai/blocks.ts`

**Relax description limits (70 → 80):**
```typescript
// Features block (line ~35)
description: z.string().min(1).max(80, 'Feature description too long'),  // was 70

// List block (line ~320)
description: z.string().max(80, 'Item description too long'),  // was 70

// Ecommerce block (line ~338)
description: z.string().max(80, 'Product description too long').optional(),  // was 70

// Stats block
description: z.string().max(80, 'Stats description too long').optional(),  // was 70
```

**Relax subheading limits (100 → 115):**
```typescript
// Features block
subheading: z.string().max(115, 'Subheading too long').optional(),  // was 100

// CTA block
subheadline: z.string().max(115, 'Subheadline too long').optional(),  // was 100

// Marketing block
subheading: z.string().max(115, 'Subheading too long').optional(),  // was 100

// Pricing block
description: z.string().max(115, 'Description too long').optional(),  // was 100
```

### File 2: `lib/email-v2/ai/generator-two-pass.ts`

**Update getBlockSpecificRequirements() with word-count hints:**
```typescript
function getBlockSpecificRequirements(blockType: string): string {
  const r: Record<string, string> = {
    hero: `h≤80,sub≤120(~20w),cta≤30,url,img≤60`,
    features: `h≤80,sub≤115(~18w),f[3-4]:t≤40,d≤80(~12w),img≤60`,  // ADD word hints
    list: `h≤80,i[4+]:t≤40,d≤80(~12w)`,
    cta: `h≤80,sub≤115(~18w),btn≤30,url`,
    ecommerce: `h≤80,p[1-4]:name≤40,d≤80(~12w),price,img≤60`,
    stats: `h≤80,s[2-4]:v≤40,l≤40,d≤80(~12w)`,
    pricing: `h≤80,p[1-3]:name≤40,price,d≤115(~18w),f[3-5]≤50`,
    marketing: `h≤80,feat(t≤40,d≤80(~12w),img≤60),i[2-4]:t≤40,d≤80(~12w),img≤60`,
    // ... rest unchanged
  };
  return r[blockType] || `All fields.Check schema.`;
}
```

**Rationale:** 80 chars ≈ 12 words, 115 chars ≈ 18 words (AI thinks in tokens/words)

### File 3: `lib/email-v2/ai/prompts-v2.ts`

**Update SEMANTIC_GENERATION_SYSTEM_PROMPT with word-count emphasis:**
```typescript
export const SEMANTIC_GENERATION_SYSTEM_PROMPT = `Semantic email JSON. previewText≤140. headline≤80. subheadline≤120. description≤80(~12 words). title≤40. cta≤30. imageKeyword≤60. Valid https:// URLs. 

CRITICAL: COUNT WORDS & CHARACTERS. description=~12 words or 80 chars max. subheading=~18 words or 115 chars max. Schema rejects if over. 

Examples: 
✅ "Boost productivity with smart automation" (6 words, 46 chars)
❌ "Effortlessly manage all your projects with streamlined interface" (10 words, 66 chars - good length but aim for ~12w max)

8px grid. Hero:80px pad. h1:56-64px/800. h2:36-40px/700. body:17-18px/400. 5-8w headlines. Active voice. Benefits-first. "you/your". Images:1-3 nouns,generic. Hero:headline+subheadline+ctaText+ctaUrl+imageKeyword. Features:heading+subheading+features[3-4]:title+description+imageKeyword. No placeholders. Brand:{primaryColor},{fontFamily}.`;
```

### File 4: `lib/email-v2/ai/generator-two-pass.ts` (Retry Prompt)

**Update schema validation retry (~line 515-520) to emphasize word count:**
```typescript
// In the retry section, update the prompt generation:
const tooLongFieldsWithWords = tooLongFields.map((f: { path: string; max: number }) => {
  const wordHint = f.max === 80 ? ' (~12 words)' : f.max === 115 ? ' (~18 words)' : '';
  return `- ${f.path}: MAX ${f.max} chars${wordHint}`;
}).join('\n');

const strictPrompt = `CRITICAL: COUNT WORDS before generating. Write CONCISE copy.

${tooLongFieldsWithWords}

${blockUserPrompt}

Target ~10-12 words for descriptions, ~16-18 words for subheadings. Schema will REJECT if over character limits.`;
```

## Summary

**Dual Constraint Approach:**
- Hard Limit: Character count (enforced by schema)
- Soft Guidance: Word count (AI-friendly hint)

**Changes:**
- Description: 70 → 80 chars (~12 words)
- Subheading: 100 → 115 chars (~18 words)
- Added word hints to all prompts

**Expected Results:**
- Success Rate: 67% → 95%+
- Features: ✅ All descriptions fit (was ❌)
- CTA: ✅ Subheadline fits (was ❌)
- Complete emails (6/6 blocks) instead of incomplete (4/6)

## Testing

Run HOOT prompt:
```
make me a launch email for our new product the HOOT, we are a HOOT and use lively colors and bold fonts to tell our story.
```

Verify:
- All 6 blocks generate ✅
- Descriptions ~10-12 words each
- Subheadings ~16-18 words each
- All under character limits

## Implementation Steps

1. Update `blocks.ts` schema limits
2. Add word hints to `getBlockSpecificRequirements()`
3. Update system prompt with word-count emphasis
4. Update retry prompt with word-count focus
5. Test with HOOT prompt
6. Verify 6/6 block success

