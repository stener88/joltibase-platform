# Week 2 Examples: Rhythm Analysis in Action

This document demonstrates the rhythm analysis system with campaigns showing high, medium, and low rhythm scores.

## Example 1: High Rhythm Score (92/100)

**Campaign:** Product launch following Editorial Impact pattern

**Structure:**
```
Block 1: hero-center (100px padding)
Block 2: stats-3-col (32px padding)  
Block 3: two-column-60-40 (48px padding)
Block 4: button (80px padding)
```

**Rhythm Analysis:**

```json
{
  "score": 92,
  "pacing": {
    "type": "editorial",
    "consistency": 75,
    "variety": 82,
    "description": "Dramatic contrast, magazine-style. Creates visual interest.",
    "spacingSequence": [100, 32, 48, 80]
  },
  "narrative": {
    "hasOpeningBeat": true,
    "hasDevelopmentBeat": true,
    "hasClimaxBeat": true,
    "hasResolutionBeat": true,
    "arcScore": 100,
    "arcType": "complete"
  },
  "visualWeight": {
    "distribution": "balanced",
    "varietyScore": 68,
    "peakIndex": 0,
    "flowDescription": "Even weight distribution. Comfortable flow."
  },
  "issues": [],
  "recommendations": []
}
```

**Pattern Validation:**

```json
{
  "matches": true,
  "score": 95,
  "spacingMatch": 98,
  "narrativeMatch": 100,
  "pacingMatch": 90,
  "issues": [],
  "details": {
    "expectedSpacing": [100, 32, 48, 80],
    "actualSpacing": [100, 32, 48, 80],
    "expectedVariety": "high",
    "actualVariety": 82
  }
}
```

**Why It Scores High:**
- ✅ Perfect spacing match (98% - within 2px on all blocks)
- ✅ Complete narrative arc (100% - all 4 beats present)
- ✅ High variety (82% - creates visual interest)
- ✅ Intentional pacing (editorial type detected)
- ✅ No issues or violations

**Console Output:**
```
📊 [GENERATOR] Generation Quality Report:
   Pattern: Editorial Impact
   Blocks: 4 layouts

   Rhythm Score: 92/100
     - Pacing: Dramatic contrast, magazine-style. Creates visual interest.
     - Narrative: complete (100%)
     - Flow: Even weight distribution. Comfortable flow.

   Pattern Match: 95/100
     - Spacing: 98%
     - Narrative: 100%
     - Pacing: 90%
```

---

## Example 2: Medium Rhythm Score (73/100)

**Campaign:** Newsletter with missing beats

**Structure:**
```
Block 1: hero-center (48px padding)
Block 2: two-column-text (40px padding)
Block 3: two-column-text (40px padding)
```

**Rhythm Analysis:**

```json
{
  "score": 73,
  "pacing": {
    "type": "conversational",
    "consistency": 82,
    "variety": 25,
    "description": "Natural, comfortable reading pace. Creates familiarity.",
    "spacingSequence": [48, 40, 40]
  },
  "narrative": {
    "hasOpeningBeat": true,
    "hasDevelopmentBeat": true,
    "hasClimaxBeat": false,
    "hasResolutionBeat": false,
    "arcScore": 50,
    "arcType": "partial"
  },
  "visualWeight": {
    "distribution": "top-heavy",
    "varietyScore": 22,
    "peakIndex": 0,
    "flowDescription": "Strong opening, fades toward end. Consider boosting finale."
  },
  "issues": [
    {
      "type": "narrative",
      "severity": "error",
      "message": "Missing resolution beat (CTA/button). Email lacks clear ending.",
      "impact": 25
    },
    {
      "type": "monotony",
      "severity": "suggestion",
      "message": "All blocks have similar spacing (variety: 25%). Lacks visual interest.",
      "impact": 10
    }
  ],
  "recommendations": [
    "End with a CTA or button layout to drive action",
    "Add more spacing contrast: Use 80-100px for opening, 30-40px for body, 60-80px for CTA"
  ]
}
```

**Pattern Validation:**

```json
{
  "matches": false,
  "score": 68,
  "spacingMatch": 72,
  "narrativeMatch": 50,
  "pacingMatch": 85,
  "issues": [
    "Missing resolution beat",
    "Narrative arc incomplete: missing resolution beat"
  ],
  "details": {
    "expectedSpacing": [48, 40, 48, 56],
    "actualSpacing": [48, 40, 40],
    "expectedVariety": "medium",
    "actualVariety": 25
  }
}
```

**Why It Scores Medium:**
- ⚠️ Missing resolution beat (-25 points)
- ⚠️ Low variety (25% - monotonous)
- ⚠️ Incomplete narrative (50% - only 2 of 4 beats)
- ✅ Good pacing type (conversational detected)
- ✅ Has opening beat

**Console Output:**
```
📊 [GENERATOR] Generation Quality Report:
   Pattern: Conversational
   Blocks: 3 layouts

   Rhythm Score: 73/100
     - Pacing: Natural, comfortable reading pace. Creates familiarity.
     - Narrative: partial (50%)
     - Flow: Strong opening, fades toward end. Consider boosting finale.

   Pattern Match: 68/100
     - Spacing: 72%
     - Narrative: 50%
     - Pacing: 85%

   💡 Recommendations:
     - End with a CTA or button layout to drive action
     - Add more spacing contrast: Use 80-100px for opening, 30-40px for body, 60-80px for CTA
```

**How to Fix:**
1. Add `stats-3-col` as climax beat (48px padding)
2. Add `button` as resolution beat (56px padding)
3. Result: Score improves to 88/100

---

## Example 3: Low Rhythm Score (55/100)

**Campaign:** Random blocks without intentional pattern

**Structure:**
```
Block 1: button (40px padding)  ← CTA first? Wrong order!
Block 2: hero-center (40px padding)
Block 3: button (40px padding)  ← Duplicate CTA?
```

**Rhythm Analysis:**

```json
{
  "score": 55,
  "pacing": {
    "type": "mixed",
    "consistency": 100,
    "variety": 0,
    "description": "Mixed pacing without clear pattern.",
    "spacingSequence": [40, 40, 40]
  },
  "narrative": {
    "hasOpeningBeat": true,
    "hasDevelopmentBeat": false,
    "hasClimaxBeat": false,
    "hasResolutionBeat": true,
    "arcScore": 50,
    "arcType": "inverted"
  },
  "visualWeight": {
    "distribution": "balanced",
    "varietyScore": 0,
    "peakIndex": 1,
    "flowDescription": "Even weight distribution. Comfortable flow."
  },
  "issues": [
    {
      "type": "narrative",
      "severity": "error",
      "message": "Missing opening beat (hero/banner). Email lacks strong introduction.",
      "impact": 25
    },
    {
      "type": "monotony",
      "severity": "suggestion",
      "message": "All blocks have similar spacing (variety: 0%). Lacks visual interest.",
      "impact": 10
    },
    {
      "type": "flow",
      "severity": "suggestion",
      "message": "Low visual variety (0%). All elements feel same weight.",
      "impact": 10
    },
    {
      "type": "pacing",
      "severity": "warning",
      "message": "Spacing feels random (consistency: 100% but variety 0%). Consider more intentional rhythm.",
      "impact": 15
    }
  ],
  "recommendations": [
    "Start with a hero or banner layout to command attention",
    "Add more spacing contrast: Use 80-100px for opening, 30-40px for body, 60-80px for CTA",
    "Create hierarchy: Make opening LARGE, development small, resolution focused",
    "Align spacing to a pattern strategy (dramatic → tight → balanced → surrounding)"
  ]
}
```

**Pattern Validation:**

```json
{
  "matches": false,
  "score": 35,
  "spacingMatch": 40,
  "narrativeMatch": 50,
  "pacingMatch": 20,
  "issues": [
    "Block 1: Spacing 40px is 60px off from expected 100px",
    "Block 2: Spacing 40px is 8px off from expected 32px",
    "Block 3: Spacing 40px is 40px off from expected 80px",
    "Narrative arc is inverted, expected complete"
  ],
  "details": {
    "expectedSpacing": [100, 32, 48, 80],
    "actualSpacing": [40, 40, 40],
    "expectedVariety": "high",
    "actualVariety": 0
  }
}
```

**Why It Scores Low:**
- ❌ CTA appears before hero (inverted narrative)
- ❌ No spacing variety (0% - all same)
- ❌ Duplicate CTAs (confusing)
- ❌ No development or climax beats
- ❌ All spacing 40px (monotonous)

**Console Output:**
```
📊 [GENERATOR] Generation Quality Report:
   Pattern: Editorial Impact
   Blocks: 3 layouts

   Rhythm Score: 55/100
     - Pacing: Mixed pacing without clear pattern.
     - Narrative: inverted (50%)
     - Flow: Even weight distribution. Comfortable flow.

   Pattern Match: 35/100
     - Spacing: 40%
     - Narrative: 50%
     - Pacing: 20%

   💡 Recommendations:
     - Start with a hero or banner layout to command attention
     - Add more spacing contrast: Use 80-100px for opening, 30-40px for body, 60-80px for CTA
     - Create hierarchy: Make opening LARGE, development small, resolution focused
     - Align spacing to a pattern strategy (dramatic → tight → balanced → surrounding)
```

**How to Fix:**
1. Reorder: hero (first) → stats → testimonial → button (last)
2. Apply pattern spacing: 80px → 32px → 48px → 60px
3. Remove duplicate CTA
4. Result: Score improves to 89/100

---

## Score Distribution Analysis

### By Pacing Type

| Pacing Type | Typical Score Range | Characteristics |
|-------------|---------------------|-----------------|
| **Editorial** | 85-95 | High variety (>60%), dramatic contrast |
| **Minimal** | 80-92 | Low variety (<40%), consistent generous spacing |
| **Conversational** | 75-88 | Medium variety (30-60%), natural rhythm |
| **Breathless** | 60-75 | Very tight spacing (<40px), urgent feel |
| **Mixed** | 40-65 | Random spacing, no clear pattern |

### By Narrative Completeness

| Arc Type | Typical Score Impact | Description |
|----------|----------------------|-------------|
| **Complete** | +10 points | All 4 beats present, bonus awarded |
| **Partial** | +0 points | 2-3 beats present, acceptable |
| **Inverted** | -15 points | Wrong order (CTA before hero) |
| **Missing** | -25 points | Fewer than 2 beats |

### By Visual Weight

| Distribution | Typical Score Impact | Description |
|--------------|----------------------|-------------|
| **Balanced** | +0 points | Even distribution, no penalties |
| **Top-heavy** | -5 points | Strong opening, weak ending |
| **Bottom-heavy** | -5 points | Weak opening (crescendo effect) |
| **Crescendo** | +5 points | Builds to climax (intentional) |
| **Decrescendo** | +0 points | Fades gently (acceptable for some patterns) |

## Key Insights

1. **Complete narratives score 15-20% higher** than partial arcs
2. **Intentional pacing** (editorial/minimal/conversational) scores better than "mixed"
3. **Variety matters** but must match pattern expectations (high for Editorial, low for Minimal)
4. **Spacing precision** within ±20px of pattern expectations maintains high scores
5. **Missing resolution beats** are most costly (-25 points)

## Testing Patterns

To test pattern quality:

```bash
# Generate with luxury keywords
Goal: "Luxury spa opening" → Minimal Luxury pattern
Expected: Low variety, high spacing, 3-4 blocks

# Generate with launch keywords  
Goal: "Launch new product" → Editorial Impact pattern
Expected: High variety, dramatic spacing, 4-6 blocks

# Generate with newsletter keywords
Goal: "Weekly newsletter" → Conversational pattern
Expected: Medium variety, balanced spacing, 4-7 blocks
```

For implementation details, see `/docs/composition/PATTERNS.md`.

