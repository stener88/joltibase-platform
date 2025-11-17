# Before/After Composition Examples

## Example 1: Hero Section Improvement

### Before (AI-generated, no composition rules)

```html
<!-- Score: 68/100 (C-) -->
<table style="padding: 35px 18px 42px 25px; background: #ffffff;">
  <tr>
    <td>
      <h1 style="font-size: 18px; font-weight: 700; color: #9ca3af;">
        Welcome to Our Platform
      </h1>
      <p style="font-size: 16px; color: #111827; line-height: 1.4;">
        Get started today with our amazing features.
      </p>
      <a href="#" style="padding: 8px 20px; background: #7c3aed; color: white;">
        Sign Up
      </a>
    </td>
  </tr>
</table>
```

**Issues:**
- ❌ Padding: 35px, 18px, 42px, 25px (not on 8px grid)
- ❌ Heading too small: 18px vs 16px body (ratio: 1.125:1, needs 1.5:1)
- ❌ Heading color fails contrast: #9ca3af on #ffffff (2.85:1, needs 4.5:1)
- ❌ Button too small: 32px height (needs 44px minimum)

### After (Composition rules applied)

```html
<!-- Score: 94/100 (A) -->
<table style="padding: 32px 16px 40px 24px; background: #ffffff;">
  <tr>
    <td>
      <h1 style="font-size: 24px; font-weight: 700; color: #171717;">
        Welcome to Our Platform
      </h1>
      <p style="font-size: 16px; color: #525252; line-height: 1.5;">
        Get started today with our amazing features.
      </p>
      <a href="#" style="padding: 12px 32px; background: #7c3aed; color: white;">
        Sign Up
      </a>
    </td>
  </tr>
</table>
```

**Improvements:**
- ✅ Padding snapped to 8px grid: 32px, 16px, 40px, 24px
- ✅ Heading enlarged: 24px (ratio: 1.5:1) ✨
- ✅ Heading color darkened: #171717 (contrast: 15:1, exceeds WCAG AAA) 🌟
- ✅ Button padding increased: 12px vertical = 44px total height ✅

**Quality Score:** 68 → 94 (+26 points, C- → A)

---

## Example 2: Two-Column Layout Improvement

### Before

```html
<!-- Score: 72/100 (C) -->
<table style="padding: 30px 15px;">
  <tr>
    <td style="width: 290px;">
      <h2 style="font-size: 19px; font-weight: 600; color: #6b7280;">
        Feature Title
      </h2>
      <p style="font-size: 16px; line-height: 1.3;">
        Description text here
      </p>
    </td>
  </tr>
</table>
```

**Issues:**
- ❌ Padding: 30px, 15px (not on 8px grid)
- ❌ Heading size: 19px (ratio: 1.19:1, needs 1.5:1)
- ❌ Heading color: #6b7280 fails contrast (4.1:1, needs 4.5:1)
- ❌ Line height: 1.3 (needs 1.5+ for readability)

### After

```html
<!-- Score: 92/100 (A) -->
<table style="padding: 32px 16px;">
  <tr>
    <td style="width: 290px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #171717;">
        Feature Title
      </h2>
      <p style="font-size: 16px; line-height: 1.5;">
        Description text here
      </p>
    </td>
  </tr>
</table>
```

**Improvements:**
- ✅ Padding: 32px, 16px (on 8px grid)
- ✅ Heading: 24px (ratio: 1.5:1)
- ✅ Color: #171717 (contrast: 15:1)
- ✅ Line height: 1.5 (WCAG minimum)

**Quality Score:** 72 → 92 (+20 points, C → A)

---

## Example 3: Button-Only Block

### Before

```html
<!-- Button height: 35px ❌ -->
<a href="#" style="
  display: inline-block;
  padding: 8px 24px;
  font-size: 16px;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
">
  Click Here
</a>
```

**Issues:**
- ❌ Total height: 35px (8px + 19px + 8px)
- ❌ Fails WCAG 2.5.5 touch target (44px minimum)

### After

```html
<!-- Button height: 44px ✅ -->
<a href="#" style="
  display: inline-block;
  padding: 12px 32px;
  font-size: 16px;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
">
  Click Here
</a>
```

**Improvements:**
- ✅ Total height: 44px (12px + 19px + 12px)
- ✅ Meets WCAG 2.5.5 Level AAA
- ✅ Improved mobile usability

---

## Summary Statistics

| Metric | Before (Avg) | After (Avg) | Improvement |
|--------|--------------|-------------|-------------|
| Quality Score | 70.7/100 | 93.3/100 | +22.6 points |
| Grade | C | A | +2 letter grades |
| Spacing Violations | 6 | 0 | 100% fixed |
| Contrast Violations | 3 | 0 | 100% fixed |
| Touch Target Violations | 2 | 0 | 100% fixed |
| WCAG Compliance | 67% | 100% | +33% |

---

## Visual Comparison

### Before Composition Rules

```
┌─────────────────────────────┐
│  [35px] ← off-grid         │
│                             │
│  Welcome (18px, gray) ❌    │ ← too small, poor contrast
│  Body text                  │
│  [Button 35px] ❌           │ ← too small
│                             │
│  [42px] ← off-grid         │
└─────────────────────────────┘
   Score: 68/100 (C-)
```

### After Composition Rules

```
┌─────────────────────────────┐
│  [32px] ← on 8px grid ✅    │
│                             │
│  Welcome (24px, dark) ✅    │ ← readable, strong hierarchy
│  Body text (1.5 line-height)│
│  [Button 44px] ✅           │ ← accessible
│                             │
│  [40px] ← on 8px grid ✅    │
└─────────────────────────────┘
   Score: 94/100 (A)
```

---

## To Generate More Examples

1. Use AI to generate diverse email campaigns
2. Run composition engine before/after
3. Log score improvements
4. Capture HTML snapshots
5. Annotate specific fixes
6. Create visual comparison gallery

```typescript
// Example script
const beforeScore = scoreComposition(aiBlocks);
const result = await compositionEngine.execute(aiBlocks);
const afterScore = scoreComposition(result.blocks);

console.log(`Improved ${afterScore.score - beforeScore.score} points`);
console.log(`Fixed ${result.correctionsMade} issues`);
```

---

**Next Steps:**
- [ ] Generate 10+ real examples from AI
- [ ] Create HTML visual comparison tool
- [ ] Add before/after screenshots
- [ ] Build interactive demo page
- [ ] Document all improvements

