# AI Integration Guide

## Overview

The Visual Grammar Engine integrates seamlessly with AI email generation, automatically improving composition quality while providing semantic controls that AI can understand.

## Integration Flow

```
User Prompt
    ↓
AI Generation (Gemini/GPT)
    ↓
Generated Blocks (JSON)
    ↓
┌─────────────────────────────┐
│  Composition Engine         │
│  - Apply 5 core rules       │
│  - Validate & correct       │
│  - Calculate quality score  │
└─────────────────────────────┘
    ↓
Corrected Blocks
    ↓
HTML Rendering
    ↓
Final Email
```

## Automatic Integration

The composition engine runs automatically after AI generation in `lib/ai/generator.ts`:

```typescript
// After AI generates blocks
const { defaultCompositionEngine, scoreComposition } = await import('../email/composition');

for (const email of generatedCampaign.emails) {
  // Apply composition rules
  const result = await defaultCompositionEngine.execute(email.blocks);
  
  // Calculate quality score
  const score = scoreComposition(result.blocks);
  
  console.log(`Score: ${score.score}/100 (${score.grade})`);
  console.log(`Corrections: ${result.correctionsMade}`);
  console.log(`Rules: ${result.appliedRules.join(', ')}`);
  
  // Warn if low quality
  if (score.score < 70) {
    console.warn('Low quality:', score.issues);
  }
  
  // Use corrected blocks
  email.blocks = result.blocks;
}
```

## Enhanced AI Prompts

### Token-Based Guidance

The AI system prompt now includes composition quality standards:

```
## Composition Quality Standards (AUTO-ENFORCED)

**1. Spacing Grid (8px):**
- Use ONLY multiples of 8: 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px
- Hero padding: 80px top/bottom, 40px left/right
- Section padding: 40-48px top/bottom, 20px left/right

**2. Typography Hierarchy:**
- Minimum heading-to-body ratio: 1.5:1 (better: 2:1)
- Example: If body is 16px, heading must be ≥24px

**3. Color Contrast (WCAG AA):**
- Dark text on light: #171717 or darker on white backgrounds
- Ensure 4.5:1 contrast ratio

**4. Touch Targets:**
- Buttons must be ≥44px height
- Default button padding: 12-14px vertical

**5. White Space:**
- Layouts need minimum 60px total padding
- Hero sections: 80px+ padding for impact
```

### Benefits

1. **Preventive:** AI learns patterns, generates better initial output
2. **Corrective:** Engine fixes any violations automatically
3. **Educational:** Logging shows what was corrected

## Semantic Composition Mapper

### Purpose

Translates human-friendly design intent into concrete token values that AI can use.

### Basic Usage

```typescript
import { SemanticCompositionMapper } from '@/lib/ai/composition-mapper';

const mapper = new SemanticCompositionMapper();

// Define semantic intent
const config = {
  aesthetic: {
    mood: 'professional',
    density: 'comfortable',
    contrast: 'moderate'
  },
  spacing: {
    verticalRhythm: 'balanced',    // tight | balanced | relaxed
    horizontalFlow: 'standard',     // compact | standard | wide
    breathing: 'comfortable'        // minimal | comfortable | generous
  },
  typography: {
    scale: 'major-third',           // minor-second | major-second | major-third
    hierarchy: 'moderate'           // flat | moderate | pronounced
  }
};

// Map to concrete values
const values = mapper.mapToConcreteValues(config);

console.log(values);
// {
//   spacing: {
//     section: '48px',      // balanced vertical rhythm
//     component: '16px',    // standard horizontal flow
//     content: '16px',      // comfortable breathing
//     padding: '16px'
//   },
//   typography: {
//     headingSize: '32px',  // 2:1 ratio (moderate hierarchy)
//     bodySize: '16px',
//     scale: 1.25,          // major-third
//     headingWeight: 700,
//     bodyWeight: 400
//   },
//   colors: {
//     text: '#525252',
//     heading: '#171717',
//     background: '#FFFFFF',
//     action: '#3B82F6'
//   }
// }
```

### Generate AI Prompt Snippet

```typescript
const promptSnippet = mapper.generatePromptSnippet(config);

console.log(promptSnippet);
// COMPOSITION GUIDANCE:
// - Spacing: Use 48px between major sections, 16px between related elements
// - Typography: Headings at 32px, body at 16px
// - Colors: Text #525252, headings #171717, actions #3B82F6
// - Hierarchy: balanced emphasis with moderate scale
```

### Recommend Layouts

```typescript
const layouts = mapper.recommendLayout(config);

console.log(layouts);
// ['hero-center', 'two-column-50-50', 'card-centered']

// For two-column + compact density
const layouts2 = mapper.recommendLayout({
  layout: { structure: 'two-column' },
  aesthetic: { density: 'compact' }
});
// ['two-column-60-40', 'two-column-50-50']
```

## Natural Language Intent Parsing

### Parse User Prompts

```typescript
import { parseNaturalLanguageIntent } from '@/lib/ai/composition-mapper';

// User prompt: "Create a spacious, elegant email campaign"
const intent = parseNaturalLanguageIntent('spacious, elegant email');

console.log(intent);
// {
//   spacing: { 
//     verticalRhythm: 'loose', 
//     horizontalFlow: 'wide', 
//     breathing: 'generous' 
//   },
//   aesthetic: { mood: 'elegant' }
// }

// User prompt: "Make it tight and compact with bold headings"
const intent2 = parseNaturalLanguageIntent('tight and compact with bold headings');
// {
//   spacing: { 
//     verticalRhythm: 'tight', 
//     horizontalFlow: 'compact', 
//     breathing: 'minimal' 
//   },
//   typography: { hierarchy: 'pronounced' }
// }
```

### Keyword Mapping

| User Says | Maps To |
|-----------|---------|
| "tight", "compact" | `spacing.verticalRhythm: 'tight'` |
| "spacious", "generous" | `spacing.verticalRhythm: 'loose'` |
| "professional", "business" | `aesthetic.mood: 'professional'` |
| "playful", "fun" | `aesthetic.mood: 'playful'` |
| "elegant", "sophisticated" | `aesthetic.mood: 'elegant'` |
| "minimal", "clean" | `aesthetic.mood: 'minimal'` |
| "flat", "subtle" | `typography.hierarchy: 'flat'` |
| "pronounced", "strong", "bold" | `typography.hierarchy: 'pronounced'` |

## Composition Feedback Loop

### Iterative Refinement

When users refine campaigns, include composition feedback:

```typescript
// In /app/api/ai/refine-campaign/route.ts

// Get current composition issues
const violations = defaultCompositionEngine.validate(campaign.blocks);
const score = scoreComposition(campaign.blocks);

// Include in refinement prompt
const compositionFeedback = `
CURRENT COMPOSITION STATUS:
- Quality Score: ${score.score}/100 (${score.grade})
- Issues Found: ${violations.length}
${violations.map(v => `  - ${v.message}`).join('\n')}

USER REQUEST: ${userRequest}

Please address both the user's request AND improve the composition issues above.
`;

// Send to AI with enhanced context
const refinedCampaign = await generateRefinement(compositionFeedback);
```

### Before/After Logging

```typescript
// Log composition improvements
const beforeScore = scoreComposition(originalBlocks);
const afterScore = scoreComposition(correctedBlocks);

console.log('Composition Improvement:');
console.log(`  Before: ${beforeScore.score}/100 (${beforeScore.grade})`);
console.log(`  After: ${afterScore.score}/100 (${afterScore.grade})`);
console.log(`  Gain: +${afterScore.score - beforeScore.score} points`);

if (afterScore.score > beforeScore.score) {
  console.log(`  Fixed categories: ${
    Object.keys(afterScore.breakdown)
      .filter(cat => afterScore.breakdown[cat] > beforeScore.breakdown[cat])
      .join(', ')
  }`);
}
```

## Quality Thresholds

### Recommended Thresholds

| Threshold | Action | Reason |
|-----------|--------|--------|
| **score < 50** | Regenerate automatically | Failing composition |
| **score < 70** | Warn designer, log issues | Below acceptable quality |
| **70-89** | Log info, proceed | Good quality |
| **90-96** | Log success | Excellent quality |
| **97-100** | Log achievement | Perfect composition |

### Implementation

```typescript
const score = scoreComposition(blocks);

if (score.score < 50) {
  console.error('⛔ Composition score too low, regenerating...');
  return await regenerateCampaign(input);
}

if (score.score < 70) {
  console.warn('⚠️ Composition quality below threshold:', {
    score: score.score,
    issues: score.issues
  });
  // Notify designer or flag for review
}

if (score.score >= 90) {
  console.log('🌟 Excellent composition quality!', {
    score: score.score,
    grade: score.grade
  });
}
```

## Monitoring & Analytics

### Track Composition Metrics

```typescript
// Track AI generation quality over time
const metrics = {
  campaignId: campaign.id,
  aiProvider: 'gemini-2.0-flash-exp',
  compositionScore: score.score,
  correctionsMade: result.correctionsMade,
  appliedRules: result.appliedRules,
  violations: violations.length,
  timestamp: new Date()
};

// Store in analytics database
await trackCompositionMetrics(metrics);
```

### Useful Metrics

- **Average score by AI model** - Compare Gemini vs GPT-4
- **Corrections per email** - Measure AI accuracy improvement
- **Most common violations** - Identify AI weak points
- **Score distribution** - Overall quality trend

### Sample Dashboard Query

```sql
SELECT 
  ai_provider,
  AVG(composition_score) as avg_score,
  AVG(corrections_made) as avg_corrections,
  COUNT(*) as total_emails
FROM composition_metrics
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY ai_provider
ORDER BY avg_score DESC;
```

## Advanced Techniques

### 1. Model-Specific Prompts

Different AI models have different strengths:

```typescript
const promptEnhancements = {
  'gemini-2.0-flash': `
    FOCUS ON: Precise numeric values for spacing and sizing.
    You're excellent at following strict constraints.
  `,
  'gpt-4o': `
    FOCUS ON: Creative layouts within the composition guidelines.
    You have freedom to innovate while staying on the 8px grid.
  `
};

const enhancedPrompt = basePrompt + promptEnhancements[model];
```

### 2. Composition-Aware Layout Selection

```typescript
// Select layout based on semantic config
const config = parseNaturalLanguageIntent(userPrompt);
const recommendedLayouts = mapper.recommendLayout(config);

// Add to AI prompt
const promptWithLayouts = `
${basePrompt}

RECOMMENDED LAYOUTS for this aesthetic:
${recommendedLayouts.map((l, i) => `${i + 1}. ${l}`).join('\n')}

Use these layouts to match the user's aesthetic intent.
`;
```

### 3. Progressive Composition Refinement

```typescript
// First pass: Generate content
const initialBlocks = await generateCampaign(input);

// Second pass: Optimize composition
const optimizedBlocks = await defaultCompositionEngine.execute(initialBlocks);

// Third pass: AI polish (optional)
if (score.score < 80) {
  const refinedBlocks = await refineWithCompositionFeedback(
    optimizedBlocks,
    violations
  );
}
```

### 4. Composition Templates

Pre-define semantic configs for common use cases:

```typescript
const templates = {
  newsletter: {
    aesthetic: { mood: 'professional', density: 'comfortable' },
    spacing: { verticalRhythm: 'balanced' },
    typography: { hierarchy: 'moderate' }
  },
  
  promotional: {
    aesthetic: { mood: 'playful', density: 'spacious' },
    spacing: { verticalRhythm: 'relaxed' },
    typography: { hierarchy: 'pronounced' }
  },
  
  transactional: {
    aesthetic: { mood: 'minimal', density: 'compact' },
    spacing: { verticalRhythm: 'tight' },
    typography: { hierarchy: 'flat' }
  }
};

// Use in generation
const config = templates[campaignType];
const promptSnippet = mapper.generatePromptSnippet(config);
```

## Troubleshooting

### Issue: AI Ignores Composition Guidelines

**Solution:** Make guidelines more explicit in prompt

```typescript
// Add CRITICAL markers and examples
const prompt = `
**CRITICAL:** All spacing MUST be multiples of 8px.
❌ Bad: padding: 35px
✅ Good: padding: 32px or 40px
`;
```

### Issue: Too Many Corrections Per Email

**Solution:** Improve AI prompt or adjust thresholds

```typescript
// Track which rules fire most
const ruleFrequency = {};
result.appliedRules.forEach(rule => {
  ruleFrequency[rule] = (ruleFrequency[rule] || 0) + 1;
});

console.log('Most common corrections:', ruleFrequency);
// Output: { 'spacing-grid-8px': 15, 'typography-hierarchy': 3 }

// Focus AI prompt on problematic areas
```

### Issue: Low Composition Scores Despite Following Guidelines

**Solution:** Check for edge cases or update rules

```typescript
// Debug specific violations
violations.forEach(v => {
  console.log(`${v.ruleId}: ${v.message}`);
  console.log('Block:', JSON.stringify(blocks.find(b => b.id === v.blockId)));
});
```

## Best Practices

1. **Always apply composition after AI generation** - Don't skip the engine
2. **Log quality scores** - Track improvement over time
3. **Use semantic mapper for consistency** - Don't hardcode values in prompts
4. **Monitor violation patterns** - Improve AI prompts based on common issues
5. **Set quality thresholds** - Auto-regenerate if score < 50
6. **Include composition in refinement** - Maintain quality through iterations

## Future Enhancements

- [ ] Composition-aware prompt optimization
- [ ] ML model for predicting composition issues
- [ ] A/B testing with composition variants
- [ ] Real-time composition feedback during generation
- [ ] Auto-regeneration for low scores

---

**Related Documentation:**
- [Composition System Overview](./README.md)
- [Composition Rules Reference](./COMPOSITION_RULES.md)
- [Semantic Controls Guide](./SEMANTIC_CONTROLS.md)

