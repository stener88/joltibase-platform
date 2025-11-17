# Visual Grammar Engine - Composition System

## Overview

The Visual Grammar Engine is a production-ready system that automatically enforces aesthetic quality and accessibility standards in email designs. It transforms "structurally valid" layouts into "compositionally beautiful" emails through design tokens, composition rules, and quality scoring.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Email Generation Flow                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AI/User Input                                              │
│       ↓                                                      │
│  Email Blocks (JSON)                                        │
│       ↓                                                      │
│  ┌──────────────────────────────────────┐                  │
│  │   Composition Engine                 │                  │
│  │  ┌────────────────────────────────┐  │                  │
│  │  │ 1. Spacing Grid Rule (w:100)  │  │                  │
│  │  │ 2. Typography Hierarchy (w:90) │  │                  │
│  │  │ 3. Contrast Rule (w:100)       │  │                  │
│  │  │ 4. Touch Target Rule (w:95)    │  │                  │
│  │  │ 5. White Space Rule (w:70)     │  │                  │
│  │  └────────────────────────────────┘  │                  │
│  └──────────────────────────────────────┘                  │
│       ↓                                                      │
│  Corrected Blocks                                           │
│       ↓                                                      │
│  Quality Score (0-100)                                      │
│       ↓                                                      │
│  Email-Safe HTML                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Three-Tier Token System

### Tier 1: Primitives (Raw Values)

```typescript
// 8px spacing grid
primitives.spacing = {
  0: '0px', 2: '8px', 4: '16px', 6: '24px',
  8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px'
}

// 11-step color scales
primitives.colors.neutral = {
  50: '#FAFAFA',  // Lightest
  500: '#737373', // Base gray
  900: '#171717', // Darkest
  950: '#0A0A0A'  // Almost black
}

// Major Third typography scale (1.25 ratio)
primitives.typography.fontSizes = {
  xs: '12px', sm: '14px', base: '16px',
  lg: '18px', xl: '20px', '2xl': '24px',
  '3xl': '28px', '4xl': '32px'
}
```

### Tier 2: Semantic (Intent-Based)

```typescript
// Spacing by intent
semantic.spacing = {
  'content.tight': '8px',
  'content.balanced': '16px',
  'content.relaxed': '24px',
  'section.standard': '40px',
  'section.hero': '80px'
}

// Colors by purpose
semantic.colors = {
  'text.primary': '#171717',
  'text.secondary': '#525252',
  'background.default': '#FFFFFF',
  'action.primary': '#3B82F6'
}

// Complete text styles
semantic.typography = {
  'body.standard': { size: '16px', lineHeight: 1.5, weight: 400 },
  'heading.primary': { size: '32px', lineHeight: 1.2, weight: 700 }
}
```

### Tier 3: Component (Application-Specific)

```typescript
// Pre-configured components
component.button = {
  paddingX: '32px',
  paddingY: '12px',
  minHeight: '44px',
  primary: { background: '#3B82F6', text: '#FFFFFF' }
}

component.hero = {
  paddingTop: '80px',
  paddingBottom: '80px',
  titleSize: '48px',
  gap: '24px'
}
```

## Composition Rules

### 1. Spacing Grid Rule (Priority: 100)

**Purpose:** Enforce 8px spacing grid for visual rhythm

**What it does:**
- Rounds all padding/margin values to nearest 8px
- Fixes: `padding: { top: 35 }` → `{ top: 32 }`
- Applies to: All blocks with spacing

**Why it matters:**
- Creates consistent visual rhythm
- Prevents arbitrary spacing decisions
- Material Design standard

### 2. Typography Hierarchy Rule (Priority: 90)

**Purpose:** Ensure clear visual hierarchy

**What it does:**
- Enforces minimum 1.5:1 heading-to-body size ratio
- Fixes: `heading: 18px, body: 16px` → `heading: 24px, body: 16px`
- Applies to: Text blocks and layout titles

**Why it matters:**
- Establishes clear information hierarchy
- Improves scannability
- Professional typography standards

### 3. Color Contrast Rule (Priority: 100 - Accessibility Critical)

**Purpose:** Ensure WCAG AA compliance

**What it does:**
- Checks 4.5:1 contrast ratio for all text
- Automatically darkens text or lightens background
- Applies to: All text, buttons, layouts

**Why it matters:**
- Legal accessibility requirement
- Improves readability for everyone
- WCAG 2.1 Level AA standard

### 4. Touch Target Rule (Priority: 95)

**Purpose:** Ensure mobile usability

**What it does:**
- Ensures all buttons ≥44px height
- Fixes: Increases padding to reach minimum
- Applies to: Button blocks

**Why it matters:**
- WCAG 2.5.5 requirement
- Prevents frustrating mobile UX
- 44px = average finger tap size

### 5. White Space Rule (Priority: 70)

**Purpose:** Ensure adequate breathing room

**What it does:**
- Checks for 30-50% white space ratio
- Increases spacing if content too cramped
- Applies to: Layout blocks

**Why it matters:**
- Improves readability
- Professional design appearance
- Reduces cognitive load

## Quality Scoring System

### Score Breakdown (0-100 points)

| Category | Points | Checks |
|----------|--------|--------|
| **Spacing** | 25 | 8px grid alignment, consistency, white space |
| **Hierarchy** | 25 | Size ratios, weight contrast, variety |
| **Contrast** | 25 | WCAG AA compliance (4.5:1 ratios) |
| **Balance** | 25 | Alignment consistency, visual weight, block variety |

### Letter Grades

- **A+ (97-100):** Exceptional composition
- **A (93-96):** Excellent quality
- **B (80-92):** Good, minor improvements possible
- **C (70-79):** Acceptable, some issues
- **D (60-69):** Below standard, needs improvement
- **F (0-59):** Failing, major issues

### Example Score

```typescript
const score = scoreComposition(blocks);

// Result:
{
  score: 94,
  grade: "A",
  breakdown: {
    spacing: 24,    // Lost 1 point (off-grid value)
    hierarchy: 23,  // Lost 2 points (weak contrast)
    contrast: 25,   // Perfect (WCAG AAA)
    balance: 22     // Lost 3 points (too many alignments)
  },
  issues: [
    "1 spacing value off 8px grid",
    "Heading size ratio could be stronger",
    "4 different alignments used"
  ],
  passing: true
}
```

## Usage Guide

### Basic Usage in Code

```typescript
import { renderBlocksToEmail } from '@/lib/email/blocks/renderers';

// Default: Composition enabled automatically
const html = await renderBlocksToEmail(blocks, globalSettings, mergeTags);

// With metadata comments
const htmlWithMeta = await renderBlocksToEmail(
  blocks, 
  globalSettings, 
  mergeTags, 
  { includeMetadata: true }
);

// Disable composition
const rawHtml = await renderBlocksToEmail(
  blocks, 
  globalSettings, 
  mergeTags, 
  { composition: { enabled: false } }
);
```

### Direct Engine Usage

```typescript
import { defaultCompositionEngine, scoreComposition } from '@/lib/email/composition';

// Apply rules
const result = await defaultCompositionEngine.execute(blocks);
console.log(`Corrections: ${result.correctionsMade}`);
console.log(`Applied: ${result.appliedRules.join(', ')}`);

// Score quality
const score = scoreComposition(result.blocks);
console.log(`Score: ${score.score}/100 (${score.grade})`);
```

### AI Integration (Automatic)

```typescript
// In AI generator - automatically applied
// lib/ai/generator.ts after parsing:

const result = await defaultCompositionEngine.execute(email.blocks);
const score = scoreComposition(result.blocks);

// Logs: Score, corrections made, applied rules
// Warnings: If score < 70
```

## Configuration

### Custom Rules

```typescript
import { CompositionEngine } from '@/lib/email/composition';

const engine = new CompositionEngine();

// Add custom rule
engine.addRule({
  id: 'brand-color-enforcement',
  name: 'Enforce Brand Colors',
  weight: 85,
  category: 'color',
  condition: (block) => block.settings?.color,
  action: (block, context) => {
    // Replace non-brand colors
    return correctedBlock;
  },
  validate: (block, context) => {
    // Check for violations
  }
});

const result = await engine.execute(blocks);
```

### Custom Middleware

```typescript
const engine = new CompositionEngine();

// Add logging middleware
engine.use(async (blocks, context, next) => {
  console.time('composition');
  const result = await next();
  console.timeEnd('composition');
  return result;
});
```

## Integration Points

### 1. Email Rendering

**File:** `lib/email/blocks/renderers/index.ts`

```typescript
// Composition applied automatically before rendering
export async function renderBlocksToEmail(
  blocks: EmailBlock[],
  globalSettings: GlobalEmailSettings,
  mergeTags?: Record<string, string>,
  options?: RenderOptions
): Promise<string>
```

### 2. AI Generation

**File:** `lib/ai/generator.ts`

```typescript
// After AI generates blocks, before rendering
const result = await defaultCompositionEngine.execute(email.blocks);
email.blocks = result.blocks; // Use corrected blocks
```

### 3. AI Prompts

**File:** `lib/ai/prompts.ts`

```
## Composition Quality Standards (AUTO-ENFORCED)
1. Spacing Grid (8px)
2. Typography Hierarchy (1.5:1 ratio)
3. Color Contrast (WCAG AA)
4. Touch Targets (44px minimum)
5. White Space (30-50%)
```

## Performance

### Benchmarks

- **Target:** <50ms per email
- **Typical:** 15-30ms for 5-10 blocks
- **Caching:** Rule evaluation cached by block state hash
- **Async:** Non-blocking execution

### Optimization

```typescript
// Rule caching automatically enabled
const cacheKey = `${rule.id}-${block.id}-${hashBlockState(block)}`;

// Performance tracking
const engine = createCompositionEngine({
  enablePerformanceTracking: true  // Logs if >50ms
});
```

## Troubleshooting

### Common Issues

**Issue:** Composition rules not applying

**Solution:**
```typescript
// Check if composition is enabled
const html = await renderBlocksToEmail(blocks, settings, tags, {
  composition: { enabled: true }  // Explicitly enable
});
```

**Issue:** Low quality score

**Solution:**
```typescript
// Check violations
const violations = engine.validate(blocks);
violations.forEach(v => {
  console.log(`${v.severity}: ${v.message}`);
  if (v.autoFixable) {
    console.log('Auto-fix available');
  }
});
```

**Issue:** Performance slow (>50ms)

**Solution:**
```typescript
// Reduce rules applied
const html = await renderBlocksToEmail(blocks, settings, tags, {
  composition: {
    enabled: true,
    rules: ['spacing-grid-8px', 'color-contrast-wcag']  // Specific rules only
  }
});
```

## Best Practices

### 1. Always Use Semantic Tokens

```typescript
// ❌ Bad: Hardcoded values
const padding = { top: 40, right: 20, bottom: 40, left: 20 };

// ✅ Good: Semantic tokens
const padding = {
  top: pxToNumber(getSpacingToken('section.standard')),
  right: pxToNumber(getSpacingToken('padding.standard')),
  bottom: pxToNumber(getSpacingToken('section.standard')),
  left: pxToNumber(getSpacingToken('padding.standard'))
};
```

### 2. Let Composition Engine Fix Issues

```typescript
// ❌ Bad: Manual correction
if (padding.top % 8 !== 0) {
  padding.top = Math.round(padding.top / 8) * 8;
}

// ✅ Good: Let engine handle it
const result = await engine.execute(blocks);
// Engine automatically rounds to 8px grid
```

### 3. Check Score Before Sending

```typescript
// ✅ Good: Quality gate
const score = scoreComposition(blocks);

if (score.score < 70) {
  console.warn('Low quality email:', score.issues);
  // Notify designer or retry generation
}
```

## Future Enhancements

### Planned Features
- [ ] Custom rule API for brand-specific guidelines
- [ ] ML-based scoring trained on designer ratings
- [ ] A/B test generation (multiple composition variants)
- [ ] Figma token sync (import/export)
- [ ] Visual regression testing
- [ ] Cross-block relationship rules (color harmony)

### Not Planned
- Complete editor redesign (extend existing)
- Real-time preview rendering (performance concern)
- Custom token creation UI (use config files)

## Resources

### Files

- **Token System:** `/lib/email/design-tokens.ts`
- **Composition Rules:** `/lib/email/composition/rules.ts`
- **Composition Engine:** `/lib/email/composition/engine.ts`
- **Quality Scoring:** `/lib/email/composition/scoring.ts`
- **Semantic Mapper:** `/lib/ai/composition-mapper.ts`

### Documentation

- [Composition Rules Reference](./COMPOSITION_RULES.md)
- [Semantic Controls Guide](./SEMANTIC_CONTROLS.md)
- [AI Integration Guide](./AI_INTEGRATION.md)

### Design Standards

- **Material Design:** 8px spacing grid
- **WCAG 2.1 Level AA:** 4.5:1 contrast ratios
- **WCAG 2.5.5:** 44px touch targets
- **Major Third Scale:** 1.25 typography ratio

## Support

For issues or questions:
1. Check logs for composition warnings
2. Review quality score breakdown
3. Validate blocks manually: `engine.validate(blocks)`
4. Consult implementation summary: `/IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** November 17, 2025  
**Version:** 1.0.0  
**Status:** Production Ready

