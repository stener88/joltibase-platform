# Contributing to Joltibase

Thank you for contributing to Joltibase! This guide will help you add new features, fix bugs, and maintain code quality.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [How to Add New Features](#how-to-add-new-features)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Testing](#testing)
6. [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (via Supabase)
- Redis (for rate limiting)
- Gemini API key

### Setup

```bash
# Clone and install
git clone <repo>
cd joltibase-platform
npm install

# Configure environment
cp .env.example .env.local
# Add your Supabase and Gemini API keys

# Run development server
npm run dev
```

###Installation

```bash
npm install
```

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY= (optional fallback)
REDIS_URL=
```

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/description` - Code improvements

### Commit Messages

Follow conventional commits:

```
feat: Add two-column layout variation
fix: Resolve toolbar positioning bug
refactor: Simplify factory renderer logic
docs: Update architecture documentation
perf: Optimize block cloning performance
```

### Pull Requests

1. Create feature branch from `develop`
2. Make changes with clear commits
3. Update documentation if needed
4. Run tests and linter
5. Create PR with description of changes
6. Request review from maintainers

---

## How to Add New Features

### Adding a New Block Type

**1. Define the Block Schema** (`lib/email/blocks/schemas.ts`)

```typescript
// 1. Settings Schema
export const NewBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  // ... your settings
});

// 2. Content Schema
export const NewBlockContentSchema = z.object({
  // ... your content structure
});

// 3. Complete Block Schema
export const NewBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('new-block'),
  position: z.number().int().min(0),
  settings: NewBlockSettingsSchema,
  content: NewBlockContentSchema,
});

// 4. Export TypeScript type
export type NewBlockType = z.infer<typeof NewBlockSchema>;
```

**2. Update Type Definitions** (`lib/email/blocks/types.ts`)

```typescript
// Add to BaseBlockType union
export type BaseBlockType =
  | 'layouts'
  | 'logo'
  // ... existing types
  | 'new-block';  // ← Add here

// Export block type
export type { NewBlockType as NewBlock } from './schemas';

// Add to EmailBlock union
export type EmailBlock =
  | LogoBlock
  | TextBlock
  // ... existing blocks
  | NewBlock;  // ← Add here
```

**3. Create Block Renderer** (`lib/email/blocks/renderers/simple-blocks.ts` or new file)

```typescript
export function renderNewBlock(
  content: any,
  settings: any,
  context: RenderContext,
  blockId?: string
): string {
  const { backgroundColor = '#ffffff', padding = { top: 20, bottom: 20, left: 20, right: 20 } } = settings;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="
          background-color: ${backgroundColor};
          padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
        ">
          <!-- Your HTML here -->
        </td>
      </tr>
    </table>
  `;
}
```

**4. Register Renderer** (`lib/email/blocks/renderers/index.ts`)

```typescript
export async function renderBlock(block: EmailBlock, context: RenderContext): Promise<string> {
  switch (block.type) {
    case 'logo':
      return renderLogoBlock(block.content, block.settings, context, block.id);
    // ... existing cases
    case 'new-block':  // ← Add here
      return renderNewBlock(block.content, block.settings, context, block.id);
    default:
      console.warn('Unknown block type:', (block as any).type);
      return '';
  }
}
```

**5. Create Settings Component** (`components/email-editor/settings/blocks/NewBlockSettings.tsx`)

```typescript
'use client';

import { useState } from 'react';
import type { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { useBlockSettingsUpdates, useBlockContentUpdates } from '@/hooks/use-block-updates';

interface NewBlockSettingsProps {
  block: EmailBlock & { type: 'new-block' };
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
  campaignId?: string;
}

export function NewBlockSettings({ block, onUpdate }: NewBlockSettingsProps) {
  const updateSettings = useBlockSettingsUpdates(block, onUpdate);
  const updateContent = useBlockContentUpdates(block, onUpdate);
  
  const settings = block.settings || {};
  const content = block.content || {};
  
  return (
    <div className="space-y-6 pb-12">
      <h3 className="text-sm font-semibold text-gray-700">New Block Settings</h3>
      
      {/* Background Color */}
      <ColorPicker
        label="Background Color"
        value={settings.backgroundColor || '#ffffff'}
        onChange={(backgroundColor) => updateSettings({ backgroundColor })}
      />
      
      {/* Padding */}
      <PaddingInput
        label="Padding"
        value={settings.padding}
        onChange={(padding) => updateSettings({ padding })}
      />
      
      {/* Add your custom controls here */}
    </div>
  );
}
```

**6. Update Block Settings Panel** (`components/email-editor/settings/BlockSettingsPanel.tsx`)

```typescript
import { NewBlockSettings } from './blocks/NewBlockSettings';

// In the switch statement:
case 'new-block':
  return <NewBlockSettings block={block as any} onUpdate={onUpdate} campaignId={campaignId} />;
```

**7. Update AI Prompts** (`lib/ai/prompts.ts`)

Add documentation for your new block type so AI can generate it:

```typescript
// In CAMPAIGN_GENERATOR_SYSTEM_PROMPT:

## Block Types

**New Block (`type: "new-block"`):**
Purpose: [Brief description]
Settings: backgroundColor, padding
Content: [Describe content structure]
Use when: [When to use this block]
Example:
{
  "id": "new-1",
  "type": "new-block",
  "position": 0,
  "settings": { "backgroundColor": "#f0f0f0", "padding": { "top": 20, ... } },
  "content": { /* your content */ }
}
```

---

### Adding a New Layout Variation

Layout variations are much easier thanks to the factory pattern!

**1. Create Config File** (`lib/email/blocks/configs/your-layout.ts`)

```typescript
import type { LayoutConfig } from './types';

export const yourLayoutConfig: LayoutConfig = {
  variation: 'your-layout-name',
  category: 'content', // or 'two-column', 'stats', 'advanced'
  displayName: 'Your Layout Name',
  description: 'Brief description of what this layout does',
  
  structure: {
    type: 'simple', // or 'two-column', 'multi-column'
    
    elements: {
      title: {
        type: 'heading',
        required: true,
        description: 'Main headline'
      },
      paragraph: {
        type: 'text',
        required: false,
        description: 'Supporting text'
      },
      button: {
        type: 'cta',
        required: false,
        description: 'Call-to-action button'
      }
    }
  },
  
  settings: {
    controls: {
      // Visual settings
      padding: {
        type: 'padding',
        label: 'Padding',
        default: { top: 60, bottom: 60, left: 20, right: 20 }
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        default: '#ffffff'
      },
      align: {
        type: 'alignment',
        label: 'Text Alignment',
        default: 'center'
      }
    }
  },
  
  defaults: {
    settings: {
      padding: { top: 60, bottom: 60, left: 20, right: 20 },
      backgroundColor: '#ffffff',
      align: 'center'
    },
    content: {
      title: {
        text: 'Your Title Here',
        fontSize: 48,
        fontWeight: 700,
        color: '#1f2937'
      },
      paragraph: {
        text: 'Your supporting text here.',
        fontSize: 18,
        color: '#6b7280'
      },
      button: {
        text: 'Get Started',
        url: '#',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff'
      }
    }
  }
};
```

**2. Register Config** (`lib/email/blocks/renderers/layout-factory.ts`)

```typescript
import { yourLayoutConfig } from '../configs/your-layout';

export function getLayoutConfig(variation: string): LayoutConfig | null {
  const configs: Record<string, LayoutConfig> = {
    'hero-center': heroCenterConfig,
    // ... existing configs
    'your-layout-name': yourLayoutConfig,  // ← Add here
  };
  
  return configs[variation] || null;
}
```

**3. Add to Schema** (`lib/email/blocks/schemas.ts`)

```typescript
export const LayoutVariationSchema = z.enum([
  'hero-center',
  // ... existing variations
  'your-layout-name',  // ← Add here
]);
```

**4. Add Display Name** (`lib/email/blocks/types.ts`)

```typescript
export function getLayoutVariationDisplayName(variation: LayoutVariation): string {
  const displayNames: Record<LayoutVariation, string> = {
    'hero-center': 'Hero Center',
    // ... existing names
    'your-layout-name': 'Your Layout Name',  // ← Add here
  };
  
  return displayNames[variation] || variation;
}
```

**That's it!** The factory automatically generates:
✅ Renderer function
✅ Settings component
✅ Type-safe interface

**Time to add:** < 30 minutes (vs 3+ hours with hand-written code)

---

### Modifying AI Prompts

**System Prompt** (`lib/ai/prompts.ts`):

```typescript
export const CAMPAIGN_GENERATOR_SYSTEM_PROMPT = `...`;
```

**Guidelines:**
- Keep under 2,000 tokens for cost efficiency
- Use concrete examples, not abstract rules
- Test with 10+ generations after changes
- Document why rules exist (helps AI understand)

**Element-Specific Prompts** (`app/api/ai/refine-element/route.ts`):

```typescript
const ELEMENT_PROMPT_TEMPLATES: Record<string, {
  role: string;
  focus: string[];
  examples: string[];
}> = {
  'your-element': {
    role: "You're editing [element type]",
    focus: ["Focus area 1", "Focus area 2"],
    examples: [
      "'user request' → How to handle it",
      "'another request' → Another transformation"
    ]
  }
};
```

**Testing Prompts:**
1. Generate 10 emails with new prompt
2. Check success rate (target: >90%)
3. Look for common AI mistakes
4. Add examples for mistakes to prompt
5. Repeat until quality improves

---

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good: Explicit types
function processBlock(block: EmailBlock): string {
  return renderBlock(block);
}

// ❌ Bad: any types
function processBlock(block: any): any {
  return renderBlock(block);
}

// ✅ Good: unknown for uncertain types
function parseValue(value: unknown): string {
  if (typeof value === 'string') return value;
  return String(value);
}
```

### React Components

```typescript
// ✅ Good: Named exports, typed props
interface BlockSettingsProps {
  block: EmailBlock;
  onUpdate: (id: string, updates: Partial<EmailBlock>) => void;
}

export function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
  return <div>...</div>;
}

// ❌ Bad: Default exports, untyped props
export default function BlockSettings(props) {
  return <div>...</div>;
}
```

### Performance

```typescript
// ✅ Good: useMemo for expensive computations
const processedBlocks = useMemo(() => 
  processBlocks(blocks),
  [blocks]
);

// ✅ Good: useCallback for callbacks
const handleUpdate = useCallback((id: string) => {
  updateBlock(id);
}, [updateBlock]);

// ❌ Bad: Inline functions in dependencies
useEffect(() => {
  fetchData();
}, [() => fetchData()]); // Creates new function every render
```

### File Structure

```
components/
  feature-name/
    FeatureName.tsx       - Main component
    FeatureNameItem.tsx   - Sub-component
    index.ts              - Exports

lib/
  feature-name/
    index.ts              - Main exports
    types.ts              - TypeScript types
    utils.ts              - Utility functions
    __tests__/
      feature.test.ts     - Tests
```

---

## Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderBlock } from '../renderers';

describe('Block Renderer', () => {
  it('renders logo block correctly', () => {
    const block = {
      id: 'logo-1',
      type: 'logo',
      position: 0,
      settings: { width: 150 },
      content: { imageUrl: 'https://...', altText: 'Logo' }
    };
    
    const html = renderBlock(block, defaultContext);
    
    expect(html).toContain('img');
    expect(html).toContain('width="150"');
    expect(html).toContain('alt="Logo"');
  });
  
  it('handles missing content gracefully', () => {
    const block = {
      id: 'logo-1',
      type: 'logo',
      position: 0,
      settings: {},
      content: {}
    };
    
    const html = renderBlock(block, defaultContext);
    
    expect(html).toBeTruthy(); // Should not throw
  });
});
```

---

## Common Tasks

### Adding a Keyboard Shortcut

**Location:** `app/dashboard/campaigns/[id]/edit/page.tsx`

```typescript
useEffect(() => {
  if (!visualEdits.state.isActive) return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // Your new shortcut
    if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleNewAction();
      return;
    }
    
    // ... existing shortcuts
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [visualEdits.state.isActive]);
```

### Debugging AI Generation

**Enable verbose logging:**

```typescript
// lib/ai/generator.ts
console.log('📝 [GENERATOR] System prompt:', systemPrompt);
console.log('👤 [GENERATOR] User prompt:', userPrompt);
console.log('🤖 [GENERATOR] AI response:', aiResult.content);
console.log('✅ [GENERATOR] Parsed campaign:', campaign);
```

**Check AI output files:**

```bash
# Look in /tmp/ for debug files
ls -la /tmp/gemini-json-error-*.json
cat /tmp/gemini-json-error-latest.json
```

**Common AI Issues:**

1. **Empty blocks:** Add default content in schema
2. **Wrong layout:** Update prompt with clearer examples
3. **Validation errors:** Check `lib/ai/validator.ts` fallback logic
4. **Timeout:** Reduce maxTokens or simplify prompt

### Optimizing Performance

**Use React DevTools Profiler:**

1. Open DevTools → Profiler tab
2. Start recording
3. Perform action
4. Stop recording
5. Look for expensive renders

**Check bundle size:**

```bash
npm run build
npm run analyze  # If analyzer is set up
```

**Common bottlenecks:**
- Large dependencies (check with `webpack-bundle-analyzer`)
- Unnecessary re-renders (add `useMemo`, `useCallback`)
- Large state objects (split into smaller pieces)
- Synchronous operations in render (move to `useEffect`)

---

## Getting Help

- **Documentation:** `/docs/` directory
- **Architecture:** `/docs/ARCHITECTURE.md`
- **Examples:** `/examples/` directory
- **Discord/Slack:** [Link to community]
- **GitHub Issues:** [Link to issues]

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Types are properly defined (no `any`)
- [ ] Components are performant (useMemo/useCallback where needed)
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] PR description explains changes
- [ ] No console.logs left in code
- [ ] Accessibility considered (ARIA labels, keyboard navigation)

---

**Thank you for contributing!** Your work makes Joltibase better for everyone. 🎉

