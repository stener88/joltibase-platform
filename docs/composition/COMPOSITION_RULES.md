# Composition Rules Reference

## Overview

Composition rules are the core of the Visual Grammar Engine. Each rule codifies a specific design principle and can automatically validate and correct email blocks.

## Rule Interface

```typescript
interface CompositionRule<T = EmailBlock> {
  id: string;           // Unique identifier
  name: string;         // Human-readable name
  description: string;  // Purpose explanation
  weight: number;       // Priority (100 = highest)
  category: 'spacing' | 'typography' | 'color' | 'hierarchy' | 'balance';
  condition: (block: T) => boolean;  // When to apply
  action: (block: T, context: RuleContext) => T;  // How to fix
  validate: (block: T, context: RuleContext) => RuleViolation | null;  // Check compliance
}
```

## Core Rules

### 1. Spacing Grid Rule

**ID:** `spacing-grid-8px`  
**Weight:** 100 (Critical)  
**Category:** Spacing

#### Purpose
Enforces Material Design's 8px spacing grid for consistent visual rhythm.

#### What It Checks
- All padding values (top, right, bottom, left)
- All spacer block heights
- Must be multiples of 8px

#### How It Fixes
Rounds values to nearest 8px increment.

#### Examples

```typescript
// ❌ Before
{
  padding: {
    top: 35,    // Not on 8px grid
    right: 18,  // Not on 8px grid
    bottom: 42, // Not on 8px grid
    left: 25    // Not on 8px grid
  }
}

// ✅ After (auto-corrected)
{
  padding: {
    top: 32,   // Rounded to 8px grid
    right: 16,  // Rounded to 8px grid
    bottom: 40, // Rounded to 8px grid
    left: 24    // Rounded to 8px grid
  }
}
```

#### Why It Matters
- Creates predictable vertical rhythm
- Makes spacing decisions intentional
- Aligns with Material Design standards
- Prevents arbitrary "eyeball" spacing

#### Design Principle
**8px Grid System** - Industry standard from Material Design, adopted by Google, Apple, and major design systems.

---

### 2. Typography Hierarchy Rule

**ID:** `typography-hierarchy`  
**Weight:** 90 (High Priority)  
**Category:** Typography

#### Purpose
Ensures clear visual hierarchy by enforcing minimum size ratios between headings and body text.

#### What It Checks
- Text blocks with weight ≥600 (likely headings)
- Layout blocks with title settings
- Minimum 1.5:1 ratio vs body text (16px)

#### How It Fixes
Increases heading size to meet minimum ratio.

#### Examples

```typescript
// ❌ Before (weak hierarchy)
{
  type: 'text',
  settings: {
    fontSize: '18px',  // Only 1.125:1 ratio
    fontWeight: 700    // Is a heading
  }
}

// ✅ After (strong hierarchy)
{
  type: 'text',
  settings: {
    fontSize: '24px',  // 1.5:1 ratio (minimum)
    fontWeight: 700
  }
}

// 🌟 Ideal (excellent hierarchy)
{
  type: 'text',
  settings: {
    fontSize: '32px',  // 2:1 ratio
    fontWeight: 700
  }
}
```

#### Recommended Ratios

| Scale | Ratio | Example (16px body) | Best For |
|-------|-------|---------------------|----------|
| Subtle | 1.2:1 | 19px | Minimal designs |
| Moderate | 1.5:1 | 24px | **Standard (enforced)** |
| Strong | 2:1 | 32px | Clear hierarchy |
| Dramatic | 3:1 | 48px | Hero sections |

#### Why It Matters
- Establishes information hierarchy
- Improves scannability
- Guides eye through content
- Professional typography standards

#### Design Principle
**Modular Scale** - Proportional sizing creates harmonious relationships between text elements.

---

### 3. Color Contrast Rule

**ID:** `color-contrast-wcag`  
**Weight:** 100 (Critical - Accessibility)  
**Category:** Color

#### Purpose
Ensures all text meets WCAG 2.1 Level AA contrast requirements for accessibility and readability.

#### What It Checks
- Text color vs background color contrast ratios
- Minimum 4.5:1 for normal text (WCAG AA)
- Minimum 7:1 for WCAG AAA (optional)

#### How It Fixes
Darkens text color in 10% increments until minimum contrast achieved (max 10 attempts).

#### Examples

```typescript
// ❌ Before (fails WCAG AA)
{
  type: 'text',
  settings: {
    color: '#9ca3af',      // Gray-400
    backgroundColor: '#ffffff'  // White
    // Contrast: 2.85:1 ❌ Fails!
  }
}

// ✅ After (passes WCAG AA)
{
  type: 'text',
  settings: {
    color: '#525252',      // Darkened (neutral-600)
    backgroundColor: '#ffffff'
    // Contrast: 7.6:1 ✅ Passes AAA!
  }
}
```

#### Contrast Requirements

| Text Type | WCAG Level | Ratio | Example |
|-----------|------------|-------|---------|
| Normal text | AA | 4.5:1 | #6b7280 on #ffffff |
| Large text (18px+) | AA | 3:1 | #9ca3af on #ffffff |
| Normal text | AAA | 7:1 | #374151 on #ffffff |

#### Contrast Calculation

Uses WCAG 2.1 relative luminance formula:

```typescript
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
contrast = (lighter + 0.05) / (darker + 0.05)
```

#### Why It Matters
- **Legal requirement** - WCAG 2.1 Level AA required by ADA
- Improves readability for everyone
- Helps users with visual impairments
- Ensures emails work in various lighting conditions

#### Design Principle
**WCAG 2.1** - Web Content Accessibility Guidelines are the international standard for digital accessibility.

---

### 4. Touch Target Rule

**ID:** `touch-target-minimum`  
**Weight:** 95 (High Priority - Accessibility)  
**Category:** Spacing

#### Purpose
Ensures all interactive elements meet minimum touch target size for mobile usability.

#### What It Checks
- Button blocks total height (content + padding)
- Minimum 44px height (WCAG 2.5.5)
- Accounts for font size, line height, and padding

#### How It Fixes
Increases vertical padding to reach 44px minimum.

#### Examples

```typescript
// ❌ Before (too small)
{
  type: 'button',
  settings: {
    fontSize: '16px',    // Content: ~19px with line-height 1.2
    padding: {
      top: 8,            // Too small
      bottom: 8          // Too small
    }
    // Total height: 35px ❌
  }
}

// ✅ After (usable)
{
  type: 'button',
  settings: {
    fontSize: '16px',
    padding: {
      top: 12,           // Increased
      bottom: 12         // Increased
    }
    // Total height: 44px ✅
  }
}
```

#### Size Guidelines

| Context | Minimum | Recommended | Best Practice |
|---------|---------|-------------|---------------|
| Mobile (WCAG 2.5.5) | 44px | 48px | 56px |
| Desktop | 32px | 40px | 44px |
| Small buttons | 44px | 44px | 48px |
| Primary CTAs | 48px | 56px | 64px |

#### Why It Matters
- **Accessibility standard** - WCAG 2.5.5 Level AAA
- Prevents "fat finger" tapping errors
- Improves mobile conversion rates
- 44px = average human finger pad size

#### Design Principle
**Fitts's Law** - Larger targets are faster and easier to acquire, especially on mobile devices.

---

### 5. White Space Rule

**ID:** `white-space-ratio`  
**Weight:** 70 (Medium Priority)  
**Category:** Spacing

#### Purpose
Ensures adequate breathing room and prevents cramped, overwhelming layouts.

#### What It Checks
- Layout blocks total padding
- Minimum 80px total (20px per side guideline)
- Heuristic for 30-50% white space ratio

#### How It Fixes
Scales padding proportionally to reach minimum threshold.

#### Examples

```typescript
// ❌ Before (cramped)
{
  type: 'layouts',
  settings: {
    padding: {
      top: 16,
      right: 12,
      bottom: 16,
      left: 12
    }
    // Total: 56px ❌ Too tight
  }
}

// ✅ After (comfortable)
{
  type: 'layouts',
  settings: {
    padding: {
      top: 24,      // Scaled up
      right: 16,    // Scaled up
      bottom: 24,   // Scaled up
      left: 16      // Scaled up
    }
    // Total: 80px ✅ Good
  }
}

// 🌟 Ideal (hero section)
{
  type: 'layouts',
  layoutVariation: 'hero-center',
  settings: {
    padding: {
      top: 80,      // Generous
      right: 40,
      bottom: 80,
      left: 40
    }
    // Total: 240px 🌟 Excellent
  }
}
```

#### White Space Guidelines

| Layout Type | Total Padding | Per Side | Purpose |
|-------------|---------------|----------|---------|
| Minimal | 60px | 15px | Compact lists |
| Standard | 80px | 20px | **Enforced minimum** |
| Comfortable | 120px | 30px | Content sections |
| Hero | 240px | 60px | Impact sections |

#### Why It Matters
- Reduces cognitive load
- Improves readability
- Creates professional appearance
- Separates content visually

#### Design Principle
**Active White Space** - Intentional spacing is a design element, not wasted space.

---

## Rule Weights & Priority

Rules are executed in order of weight (highest first):

```
1. Spacing Grid (100)
2. Contrast Rule (100)     ← Tied, alphabetical
3. Touch Target (95)
4. Typography Hierarchy (90)
5. White Space (70)
```

### Why Priority Matters

Higher priority rules run first and can affect later rules:

```typescript
// Example: Spacing Grid runs before Typography
Block { padding: 35px, fontSize: '17px' }
  → Spacing Grid: padding → 32px
  → Typography: fontSize → 24px (hierarchy fix)
  → Final: { padding: 32px, fontSize: '24px' }
```

## Custom Rules

### Creating Custom Rules

```typescript
import { CompositionRule } from '@/lib/email/composition';

const brandColorRule: CompositionRule = {
  id: 'brand-color-enforcement',
  name: 'Enforce Brand Colors',
  description: 'Replace off-brand colors with approved palette',
  weight: 85,  // After core rules
  category: 'color',
  
  condition: (block) => {
    return block.settings?.color !== undefined;
  },
  
  action: (block, context) => {
    const approvedColors = ['#7c3aed', '#2563eb', '#16a34a'];
    const currentColor = block.settings.color as string;
    
    if (!approvedColors.includes(currentColor)) {
      return {
        ...block,
        settings: {
          ...block.settings,
          color: '#7c3aed'  // Default brand color
        }
      };
    }
    
    return block;
  },
  
  validate: (block, context) => {
    const approvedColors = ['#7c3aed', '#2563eb', '#16a34a'];
    const currentColor = block.settings?.color as string;
    
    if (currentColor && !approvedColors.includes(currentColor)) {
      return {
        ruleId: 'brand-color-enforcement',
        blockId: block.id,
        message: `Non-brand color used: ${currentColor}`,
        severity: 'warning',
        autoFixable: true
      };
    }
    
    return null;
  }
};

// Use in engine
const engine = new CompositionEngine();
engine.addRule(brandColorRule);
```

### Rule Categories

- **spacing** - Padding, margins, whitespace
- **typography** - Font sizes, weights, line heights
- **color** - Color palettes, contrast
- **hierarchy** - Visual importance, emphasis
- **balance** - Alignment, distribution, symmetry

## Best Practices

### 1. Keep Rules Focused

Each rule should check ONE thing:

```typescript
// ❌ Bad: Multiple concerns
const megaRule = {
  action: (block) => {
    // Fixes spacing, colors, typography...
  }
};

// ✅ Good: Single responsibility
const spacingRule = {
  action: (block) => {
    // Only fixes spacing
  }
};
```

### 2. Make Rules Idempotent

Applying a rule twice should produce same result:

```typescript
// ✅ Good: Idempotent
action: (block) => {
  return {
    ...block,
    settings: {
      ...block.settings,
      padding: snapToGrid(block.settings.padding)
    }
  };
  // snapToGrid(40) === 40 (already on grid)
}
```

### 3. Provide Clear Violation Messages

```typescript
// ❌ Bad: Vague
message: 'Spacing wrong'

// ✅ Good: Specific
message: 'Spacing not on 8px grid: 35px, 42px (should be 32px, 40px)'
```

### 4. Use Appropriate Weights

- **100:** Critical (accessibility, legal requirements)
- **90-95:** High priority (usability, brand standards)
- **70-80:** Medium priority (aesthetics, polish)
- **50-60:** Low priority (suggestions, optimizations)

## Troubleshooting

### Rule Not Applying

**Check condition function:**
```typescript
console.log(rule.condition(block));  // Should return true
```

### Unexpected Corrections

**Check rule order:**
```typescript
// Higher weight rules run first and can affect later rules
const rules = engine.rules.sort((a, b) => b.weight - a.weight);
console.log(rules.map(r => `${r.name} (${r.weight})`));
```

### Performance Issues

**Profile rule execution:**
```typescript
const engine = createCompositionEngine({
  enablePerformanceTracking: true
});

// Logs if any rule takes >50ms
```

---

**Related Documentation:**
- [Composition System Overview](./README.md)
- [Semantic Controls Guide](./SEMANTIC_CONTROLS.md)
- [AI Integration Guide](./AI_INTEGRATION.md)

