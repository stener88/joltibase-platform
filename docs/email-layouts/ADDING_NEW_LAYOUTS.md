# Adding New Layouts Guide

This guide walks you through adding a new layout variation to the Designer-Ready Layout System in under 30 minutes.

## Prerequisites

- Basic TypeScript knowledge
- Understanding of React components
- Familiarity with email HTML constraints (table-based layouts, 600px width)
- Read `LAYOUT_SYSTEM_OVERVIEW.md` first

## Overview

Adding a new layout involves 7-9 steps:
1. ✅ Create TypeScript config file
2. ✅ Register config in factory
3. ✅ Add to type system
4. ✅ Add display name
5. ✅ Add to Zod schema
6. ✅ Add default content and settings
7. ✅ Add variation metadata
8. ⚠️ (Optional) Create hand-written renderer for complex layouts
9. ✅ Test the layout

Estimated time: **20-30 minutes** for simple layouts, **45-60 minutes** for complex layouts.

---

## Step 1: Create TypeScript Config File

**Location**: `lib/email/blocks/configs/{your-layout-name}.ts`

**Template**:
```typescript
import { LayoutConfig } from './types';

export const {yourLayoutName}Config: LayoutConfig = {
  id: '{your-layout-id}',
  name: '{Display Name}',
  description: '{Short description for developers}',
  
  elements: [
    // Define UI elements (title, paragraph, button, etc.)
  ],
  
  settingsControls: {
    // Define available controls in settings panel
  },
  
  defaults: {
    // Default styling values
  }
};
```

**Example** (Simple hero layout):
```typescript
import { LayoutConfig } from './types';

export const heroBannerConfig: LayoutConfig = {
  id: 'hero-banner',
  name: 'Hero Banner',
  description: 'Large banner with centered content',
  
  elements: [
    {
      type: 'title',
      contentKey: 'title',
      label: 'Headline',
      required: true,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
    },
    {
      type: 'button',
      contentKey: 'button',
      label: 'Call to Action',
      required: false,
      options: {
        includeUrl: true,
      },
    },
  ],
  
  settingsControls: {
    toggles: ['showTitle', 'showParagraph', 'showButton'],
    colors: ['backgroundColor', 'titleColor', 'paragraphColor'],
    spacing: true,
    alignment: true,
  },
  
  defaults: {
    backgroundColor: '#f9fafb',
    padding: { top: 60, right: 40, bottom: 60, left: 40 },
    align: 'center',
    titleColor: '#111827',
    paragraphColor: '#6b7280',
  }
};
```

### Available Element Types

| Type | Purpose | Options |
|------|---------|---------|
| `header` | Small eyebrow text above title | - |
| `title` | Main headline | - |
| `paragraph` | Body text | - |
| `button` | CTA button | `includeUrl: boolean` |
| `badge` | Small label/tag | - |
| `subtitle` | Secondary heading | - |
| `text-area` | Multi-line text | `rows: number` |
| `image` | Image upload | - |
| `items` | Array of items (for grids) | `itemFields: Array` |
| `divider` | Horizontal line | - |

### Available Settings Controls

```typescript
settingsControls: {
  toggles?: string[];  // e.g., ['showTitle', 'showButton']
  colors?: Array<{     // Color pickers
    key: string;       // e.g., 'backgroundColor'
    label: string;     // e.g., 'Background Color'
  }>;
  spacing?: boolean;   // Padding controls (top, right, bottom, left)
  alignment?: boolean; // Text alignment (left, center, right)
  flip?: boolean;      // Flip layout orientation
  custom?: Array<{     // Custom controls
    type: 'checkbox' | 'select' | 'number';
    key: string;
    label: string;
    options?: string[];     // For select
    defaultValue?: any;
    min?: number;           // For number
    max?: number;
  }>;
}
```

---

## Step 2: Register Config in Factory

**File**: `lib/email/blocks/renderers/layout-factory.ts`

**What to do**: Import your config and add it to the `configs` object in `getLayoutConfig()`.

```typescript
// At top of file
import { heroBannerConfig } from '../configs/hero-banner';

// In getLayoutConfig function
export function getLayoutConfig(variation: string): LayoutConfig | null {
  const configs: Record<string, LayoutConfig> = {
    'hero-center': heroCenterConfig,
    // ... existing configs ...
    'hero-banner': heroBannerConfig,  // Add your config here
  };
  
  return configs[variation] || null;
}
```

---

## Step 3: Add to Type System

**File**: `lib/email/blocks/types.ts`

**What to do**: Add your layout variation to the `LayoutVariation` type.

```typescript
export type LayoutVariation =
  // Hero & Content Layouts
  | 'hero-center'
  | 'hero-banner'  // Add your layout here
  // Two-Column Layouts
  | 'two-column-50-50'
  // ... rest of layouts
```

**Important**: Keep layouts organized by category with comments!

---

## Step 4: Add Display Name

**File**: `lib/email/blocks/types.ts` (same file, scroll down)

**What to do**: Add a display name to `getLayoutVariationDisplayName()`.

```typescript
export function getLayoutVariationDisplayName(variation: LayoutVariation): string {
  const displayNames: Record<LayoutVariation, string> = {
    // Hero & Content Layouts
    'hero-center': 'Hero Center',
    'hero-banner': 'Hero Banner',  // Add display name here
    // ... rest of display names
  };
  
  return displayNames[variation] || variation;
}
```

---

## Step 5: Add to Zod Schema

**File**: `lib/email/blocks/schemas.ts`

**What to do**: Add your layout to the `LayoutVariationSchema` enum.

```typescript
export const LayoutVariationSchema = z.enum([
  // Hero & Content
  'hero-center',
  'hero-banner',  // Add here
  // Two-Column
  'two-column-50-50',
  // ... rest
]);
```

**Why?**: This enables runtime validation for AI-generated campaigns.

---

## Step 6: Add Default Content and Settings

**File**: `lib/email/blocks/registry/defaults.ts`

**What to do**: Add cases to both `getDefaultBlockContent()` and `getDefaultBlockSettings()`.

### Default Content
```typescript
export function getDefaultBlockContent(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    // ... other cases ...
    
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      // Add your layout here
      if (variation === 'hero-banner') {
        return {
          title: 'Welcome to Our Platform',
          paragraph: 'Discover amazing features and grow your business with our innovative solutions.',
          button: { text: 'Get Started Free', url: '#' },
        };
      }
      
      // ... other layouts ...
    }
  }
}
```

### Default Settings
```typescript
export function getDefaultBlockSettings(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    // ... other cases ...
    
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      const baseSettings = {
        align: 'center',
        showTitle: true,
        showParagraph: true,
        showButton: true,
      };
      
      // Add your layout here
      if (variation === 'hero-banner') {
        return {
          ...baseSettings,
          padding: { top: 80, right: 40, bottom: 80, left: 40 },
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          paragraphColor: '#374151',
          titleFontSize: '42px',
          paragraphFontSize: '18px',
          buttonBackgroundColor: '#000000',
          buttonTextColor: '#ffffff',
          buttonBorderRadius: '8px',
        };
      }
      
      // ... other layouts ...
    }
  }
}
```

---

## Step 7: Add Variation Metadata

**File**: `lib/email/blocks/registry/variations.ts`

**What to do**: Add your layout to `LAYOUT_VARIATION_DEFINITIONS`.

```typescript
export const LAYOUT_VARIATION_DEFINITIONS: Record<LayoutVariation, LayoutVariationDefinition> = {
  // Hero & Content Layouts
  'hero-center': {
    variation: 'hero-center',
    name: 'Hero Center',
    description: 'Centered hero section with vertical stack',
    category: 'hero',
    supportsImage: false,
    supportsButton: true,
  },
  'hero-banner': {  // Add your layout here
    variation: 'hero-banner',
    name: 'Hero Banner',
    description: 'Large banner with centered content and bold styling',
    category: 'hero',
    supportsImage: false,
    supportsButton: true,
  },
  // ... rest
};
```

---

## Step 8 (Optional): Create Hand-Written Renderer

**When to create a hand-written renderer:**
- ✅ Complex table structures (multi-column, grids)
- ✅ Special positioning requirements (absolute, overlays)
- ✅ Items arrays (stats, features)
- ✅ Custom width calculations
- ❌ Simple vertical stacks (use factory renderer)

**For simple layouts**: Skip this step! The factory will auto-generate the renderer.

**For complex layouts**: Create a renderer function.

**File**: `lib/email/blocks/renderers/layout-blocks.ts` (or `advanced-layouts.ts`)

```typescript
export function renderHeroBannerLayout(content: any, settings: any, context: RenderContext): string {
  const title = content.title || '';
  const paragraph = content.paragraph || '';
  const button = content.button;
  
  const backgroundColor = settings.backgroundColor || '#ffffff';
  const padding = settings.padding || { top: 80, right: 40, bottom: 80, left: 40 };
  
  // Build HTML with email-safe tables
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px; text-align: center;">
          ${title ? `<h1 style="margin: 0 0 20px 0; font-size: 42px; font-weight: 700; color: ${settings.titleColor};">${escapeHtml(title)}</h1>` : ''}
          ${paragraph ? `<p style="margin: 0 0 30px 0; font-size: 18px; color: ${settings.paragraphColor};">${escapeHtml(paragraph)}</p>` : ''}
          ${button ? renderLayoutButton(button, settings, context) : ''}
        </td>
      </tr>
    </table>
  `;
}
```

**Then register it** in `lib/email/blocks/renderers/layout-blocks.ts`:

```typescript
export function renderLayoutBlock(block: EmailBlock, context: RenderContext): string {
  const variation = (block as any).layoutVariation || 'unknown';
  const settings = block.settings || {};
  const content = block.content || {};
  
  // Try factory-generated renderer first
  const { getFactoryRenderer } = require('./layout-factory');
  const factoryRenderer = getFactoryRenderer(variation);
  if (factoryRenderer) {
    return factoryRenderer(content, settings, context);
  }
  
  // Route to hand-written renderers
  switch (variation) {
    case 'hero-center':
      return renderHeroCenterLayout(content, settings, context);
    case 'hero-banner':  // Add your renderer here
      return renderHeroBannerLayout(content, settings, context);
    // ... rest
  }
}
```

---

## Step 9: Test the Layout

### Checklist

- [ ] **Visual Editor**: Layout appears in the layout selector
- [ ] **Preview**: Thumbnail preview looks correct
- [ ] **Settings**: All controls render and work
- [ ] **Content**: Default content loads on creation
- [ ] **Styling**: Default styling matches design intent
- [ ] **Rendering**: HTML output looks correct in preview
- [ ] **Responsiveness**: Works at 600px width
- [ ] **Email Clients**: Test in Gmail, Outlook, Apple Mail
- [ ] **TypeScript**: No type errors
- [ ] **Console**: No runtime errors

### Testing Steps

1. **Start dev server**: `npm run dev`

2. **Create a campaign**:
   - Go to campaigns
   - Create new campaign
   - Open visual editor

3. **Add your layout**:
   - Click "+" to add block
   - Select "Layouts"
   - Find your layout in the picker
   - Click to add

4. **Test settings**:
   - Verify all controls appear
   - Change colors, text, padding
   - Toggle visibility options
   - Upload images (if applicable)

5. **Test content**:
   - Edit title, paragraph, button
   - Verify changes reflect in preview
   - Test with long/short text
   - Test with special characters

6. **Test preview**:
   - Switch between desktop/mobile
   - Check spacing and alignment
   - Verify no overflow issues
   - Test in chat mode

7. **Test email output**:
   - Send test email
   - Check in Gmail, Outlook, Apple Mail
   - Verify spacing, colors, fonts

---

## Common Pitfalls

### ❌ Forgetting to Register Config
**Symptom**: "Layout config not found" error

**Fix**: Make sure you imported and added to `getLayoutConfig()` in `layout-factory.ts`

### ❌ Type Mismatch
**Symptom**: TypeScript errors about `LayoutVariation`

**Fix**: Ensure you added to ALL three places:
1. `LayoutVariation` type in `types.ts`
2. `LayoutVariationSchema` in `schemas.ts`
3. `getLayoutVariationDisplayName()` in `types.ts`

### ❌ Missing Defaults
**Symptom**: Layout renders with no content or blank settings

**Fix**: Add cases to both `getDefaultBlockContent()` and `getDefaultBlockSettings()`

### ❌ Settings Not Showing
**Symptom**: Layout settings panel is empty

**Fix**: Check that config is properly exported and imported in factory

### ❌ Input Focus Loss
**Symptom**: Typing in inputs causes loss of focus after one character

**Fix**: This shouldn't happen with factory components (they use `useMemo`), but if you created a custom component, wrap it in `useMemo`

---

## Quick Reference: File Checklist

When adding a new layout, touch these files:

1. ✅ `lib/email/blocks/configs/{name}.ts` - Create config
2. ✅ `lib/email/blocks/renderers/layout-factory.ts` - Register config
3. ✅ `lib/email/blocks/types.ts` - Add to type + display name
4. ✅ `lib/email/blocks/schemas.ts` - Add to Zod schema
5. ✅ `lib/email/blocks/registry/defaults.ts` - Add defaults
6. ✅ `lib/email/blocks/registry/variations.ts` - Add metadata
7. ⚠️ `lib/email/blocks/renderers/layout-blocks.ts` - (Optional) Add renderer
8. ⚠️ `lib/ai/prompts.ts` - (Optional) Add to AI prompt if should be AI-generatable

---

## Example: Complete Implementation

See `LAYOUT_EXAMPLES.md` for 4 complete, working examples showing:
- Simple layout (factory renderer)
- Medium complexity (hand-written renderer)
- Complex layout with items array
- Advanced layout with all features

---

## Getting Help

**Troubleshooting**: See `TROUBLESHOOTING.md`

**Config Reference**: See `CONFIG_SCHEMA_REFERENCE.md`

**System Overview**: See `LAYOUT_SYSTEM_OVERVIEW.md`

**Questions?**: Ask in #engineering-help channel

