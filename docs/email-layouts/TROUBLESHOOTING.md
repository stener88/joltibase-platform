# Troubleshooting Guide

Common issues and solutions when working with the Designer-Ready Layout System.

---

## Table of Contents

1. [Layout Not Appearing in Selector](#layout-not-appearing-in-selector)
2. [Settings Panel Empty or Missing Controls](#settings-panel-empty-or-missing-controls)
3. [Input Focus Loss (Typing Loses Focus)](#input-focus-loss-typing-loses-focus)
4. [Default Content Not Loading](#default-content-not-loading)
5. [Renderer Not Working or Blank Output](#renderer-not-working-or-blank-output)
6. [TypeScript Errors](#typescript-errors)
7. [Layout Preview Inaccurate](#layout-preview-inaccurate)
8. [Image Upload Not Working](#image-upload-not-working)
9. [Items Array Not Displaying](#items-array-not-displaying)
10. [Custom Controls Not Rendering](#custom-controls-not-rendering)

---

## Layout Not Appearing in Selector

### Symptoms
- New layout doesn't show up in the layout picker
- "Unknown layout variation" error in console
- Layout selector shows fewer than expected options

### Root Causes
1. Config not registered in factory
2. Type not added to `LayoutVariation`
3. Display name missing
4. Metadata not added to `variations.ts`

### Solution Checklist

**Step 1: Verify Config Registration**

Check `lib/email/blocks/renderers/layout-factory.ts`:

```typescript
export function getLayoutConfig(variation: string): LayoutConfig | null {
  const configs: Record<string, LayoutConfig> = {
    'hero-center': heroCenterConfig,
    'your-layout': yourLayoutConfig,  // ✅ Must be here
  };
  return configs[variation] || null;
}
```

**Step 2: Verify Type Definition**

Check `lib/email/blocks/types.ts`:

```typescript
export type LayoutVariation =
  | 'hero-center'
  | 'your-layout'  // ✅ Must be here
  // ...
```

**Step 3: Verify Display Name**

Check `lib/email/blocks/types.ts`:

```typescript
export function getLayoutVariationDisplayName(variation: LayoutVariation): string {
  const displayNames: Record<LayoutVariation, string> = {
    'hero-center': 'Hero Center',
    'your-layout': 'Your Layout',  // ✅ Must be here
  };
  return displayNames[variation] || variation;
}
```

**Step 4: Verify Zod Schema**

Check `lib/email/blocks/schemas.ts`:

```typescript
export const LayoutVariationSchema = z.enum([
  'hero-center',
  'your-layout',  // ✅ Must be here
]);
```

**Step 5: Verify Metadata**

Check `lib/email/blocks/registry/variations.ts`:

```typescript
export const LAYOUT_VARIATION_DEFINITIONS: Record<LayoutVariation, LayoutVariationDefinition> = {
  'your-layout': {  // ✅ Must be here
    variation: 'your-layout',
    name: 'Your Layout',
    description: 'Description here',
    category: 'content',
  },
};
```

### Quick Test
```bash
# Restart dev server
npm run dev
# Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
```

---

## Settings Panel Empty or Missing Controls

### Symptoms
- Settings panel shows "No settings available"
- Some controls missing (toggles, colors, etc.)
- Panel renders but is blank

### Root Causes
1. Config not properly exported
2. Factory can't find config
3. `settingsControls` object misconfigured
4. Import path incorrect

### Solution

**Step 1: Verify Config Export**

Check your config file:

```typescript
// ✅ Correct
export const yourLayoutConfig: LayoutConfig = { /* ... */ };

// ❌ Wrong - not exported
const yourLayoutConfig: LayoutConfig = { /* ... */ };
```

**Step 2: Verify Import in Factory**

Check `layout-factory.ts`:

```typescript
// ✅ Correct
import { yourLayoutConfig } from '../configs/your-layout';

// ❌ Wrong - typo or wrong path
import { yourLayoutConfig } from '../configs/your-layuot';  // Typo!
```

**Step 3: Verify settingsControls Structure**

```typescript
settingsControls: {
  toggles: ['showTitle'],  // ✅ Array of strings
  colors: [
    { key: 'backgroundColor', label: 'Background' }  // ✅ Array of objects
  ],
  spacing: true,  // ✅ Boolean
  alignment: true,  // ✅ Boolean
}
```

**Step 4: Check Console for Errors**

Open browser DevTools (F12) → Console tab. Look for:
- "Layout config not found"
- Import errors
- TypeScript compilation errors

### Quick Fix
```bash
# Rebuild and restart
rm -rf .next
npm run dev
```

---

## Input Focus Loss (Typing Loses Focus)

### Symptoms
- Type one character, input loses focus
- Have to click input again for each character
- Only happens in settings panel

### Root Cause
Settings component is being recreated on every render, causing React to remount it.

### Solution

**Check `LayoutBlockSettings.tsx` uses `useMemo`**:

```typescript
// ✅ Correct - Component is memoized
export function LayoutBlockSettings({ block, onUpdate, campaignId }: Props) {
  const variation = block.layoutVariation || 'unknown';
  
  const config = getLayoutConfig(variation);
  const FactorySettings = useMemo(
    () => config ? createLayoutSettingsComponent(config) : null,
    [variation]  // Only recreate if variation changes
  );
  
  if (FactorySettings) {
    return <FactorySettings block={block} onUpdate={onUpdate} campaignId={campaignId} />;
  }
  
  return <LegacyLayoutBlockSettings block={block} onUpdate={onUpdate} campaignId={campaignId} />;
}

// ❌ Wrong - Component recreated every render
export function LayoutBlockSettings({ block, onUpdate, campaignId }: Props) {
  const config = getLayoutConfig(block.layoutVariation);
  const FactorySettings = createLayoutSettingsComponent(config);  // ❌ No useMemo!
  
  return <FactorySettings block={block} onUpdate={onUpdate} campaignId={campaignId} />;
}
```

### If Creating Custom Components

Always wrap factory-generated components in `useMemo`:

```typescript
const MyCustomComponent = useMemo(
  () => createLayoutSettingsComponent(config),
  [config.id]  // Dependencies that should trigger recreation
);
```

---

## Default Content Not Loading

### Symptoms
- New layout block has empty content
- All inputs are blank when block is added
- Have to manually enter all content

### Root Causes
1. `getDefaultBlockContent()` missing case
2. `createLayoutBlock()` not passing variation
3. Layout variation changed but content not reset

### Solution

**Step 1: Add Default Content**

Check `lib/email/blocks/registry/defaults.ts`:

```typescript
export function getDefaultBlockContent(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      // ✅ Must have a case for your layout
      if (variation === 'your-layout') {
        return {
          title: 'Default Title',
          paragraph: 'Default description text.',
          button: { text: 'Click Here', url: '#' },
        };
      }
      
      // ... other layouts
    }
  }
}
```

**Step 2: Verify createLayoutBlock Passes Variation**

Check `lib/email/blocks/registry/index.ts`:

```typescript
// ✅ Correct
export function createLayoutBlock(layoutVariation: string, position: number = 0): EmailBlock {
  return {
    id: generateBlockId(),
    type: 'layouts',
    layoutVariation,
    position,
    settings: getDefaultBlockSettings('layouts', { layoutVariation }),  // ✅
    content: getDefaultBlockContent('layouts', { layoutVariation }),    // ✅
  } as any;
}
```

**Step 3: Verify Variation Selector Resets Content**

When switching layouts, content should be reset. Check `LayoutVariationSelector.tsx`:

```typescript
const handleSelectVariation = (variation: LayoutVariation) => {
  const newContent = getDefaultBlockContent('layouts', { layoutVariation: variation });
  const newSettings = getDefaultBlockSettings('layouts', { layoutVariation: variation });
  
  onUpdate(block.id, { 
    layoutVariation: variation,
    content: newContent,      // ✅ Reset content
    settings: newSettings,    // ✅ Reset settings
  });
};
```

---

## Renderer Not Working or Blank Output

### Symptoms
- Layout preview is completely blank
- HTML output is empty
- "Renderer not found" in console

### Root Causes
1. Renderer not created (for complex layouts)
2. Renderer not registered in router
3. Factory renderer returning null when it shouldn't
4. Content structure mismatch

### Solution

**Step 1: Check Renderer Routing**

For **simple layouts** (factory renderer):

Check `lib/email/blocks/renderers/layout-factory.ts`:

```typescript
export function getFactoryRenderer(variation: string): LayoutRendererFunction | null {
  // Only hero-center uses factory renderer by default
  if (variation !== 'hero-center') {
    return null;  // Other layouts use hand-written renderers
  }
  
  // If adding new simple layout, add it here:
  if (variation === 'hero-center' || variation === 'your-simple-layout') {
    const config = getLayoutConfig(variation);
    if (!config) return null;
    return createLayoutRenderer(config);
  }
  
  return null;
}
```

For **complex layouts** (hand-written renderer):

Check `lib/email/blocks/renderers/layout-blocks.ts`:

```typescript
export function renderLayoutBlock(block: EmailBlock, context: RenderContext): string {
  const variation = (block as any).layoutVariation || 'unknown';
  
  // Try factory first
  const { getFactoryRenderer } = require('./layout-factory');
  const factoryRenderer = getFactoryRenderer(variation);
  if (factoryRenderer) {
    return factoryRenderer(content, settings, context);
  }
  
  // Route to hand-written renderers
  switch (variation) {
    case 'your-layout':  // ✅ Add your case here
      return renderYourLayout(content, settings, context);
    // ... other cases
  }
  
  return `<!-- Unknown layout: ${variation} -->`;
}
```

**Step 2: Verify Renderer Function Exists**

If using hand-written renderer, make sure function is defined:

```typescript
export function renderYourLayout(content: any, settings: any, context: RenderContext): string {
  // ✅ Must return HTML string
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>${content.title || ''}</td>
      </tr>
    </table>
  `;
}
```

**Step 3: Check Content Structure**

Content keys in renderer must match config:

```typescript
// Config
elements: [
  { type: 'title', contentKey: 'headline' },  // ← 'headline'
]

// Renderer
const title = content.headline || '';  // ✅ Use 'headline'
const title = content.title || '';     // ❌ Wrong key!
```

---

## TypeScript Errors

### Common Error 1: "Type X is not assignable to type LayoutVariation"

**Cause**: Layout variation not added to type definition.

**Fix**: Add to `lib/email/blocks/types.ts`:

```typescript
export type LayoutVariation =
  | 'hero-center'
  | 'your-layout'  // ← Add here
```

### Common Error 2: "Property X does not exist in type DefaultValues"

**Cause**: Using a settings key that's not in the interface.

**Fix**: Add to `lib/email/blocks/configs/types.ts`:

```typescript
export interface DefaultValues {
  backgroundColor?: string;
  // ... existing properties
  yourCustomProperty?: string;  // ← Add new property
}
```

### Common Error 3: "Object literal may only specify known properties"

**Cause**: Typo or invalid property in config object.

**Fix**: Check config against `LayoutConfig` interface. Use IDE autocomplete (Ctrl+Space) to see valid properties.

### Common Error 4: "Cannot find module '../configs/your-layout'"

**Cause**: Import path incorrect or file doesn't exist.

**Fix**:
1. Verify file exists at `lib/email/blocks/configs/your-layout.ts`
2. Check import path is correct
3. Restart TypeScript server (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

---

## Layout Preview Inaccurate

### Symptoms
- Thumbnail in selector doesn't match actual output
- Preview looks different from rendered block
- Wrong content showing in preview

### Root Cause
Preview in `LayoutVariationSelector.tsx` is hard-coded, not generated from config.

### Solution

Update preview for your layout in `components/email-editor/settings/layouts/LayoutVariationSelector.tsx`:

```typescript
// Find your layout variation check
if (variation === 'your-layout') {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-2">
      {/* Mirror actual layout structure */}
      <div className="text-xs font-semibold mb-1">Title</div>
      <div className="w-full h-16 bg-gray-200 rounded mb-1"></div>
      <div className="text-[10px] text-gray-500">Description</div>
    </div>
  );
}
```

**Tips**:
- Use exact default content from `defaults.ts`
- Match color scheme from default settings
- Maintain miniature dimensions (w-full h-full)
- Keep structure simple (it's a preview)

---

## Image Upload Not Working

### Symptoms
- Click "Upload Image" but nothing happens
- Modal doesn't open
- Image not displaying after upload

### Root Causes
1. Image element not in config
2. Upload modal not implemented in factory
3. `campaignId` missing

### Solution

**Step 1: Verify Image Element in Config**

```typescript
elements: [
  {
    type: 'image',  // ✅ Must be 'image'
    contentKey: 'image',  // ✅ Standard key
    label: 'Hero Image',
    required: false,
    options: {
      includeAltText: true,  // ✅ Optional
    },
  },
]
```

**Step 2: Check Factory Has Image Handler**

The factory should automatically handle image elements. If custom implementation, ensure modal is imported:

```typescript
import ImageUploadModal from '@/components/ui/ImageUploadModal';
```

**Step 3: Verify campaignId is Passed**

Check parent component passes `campaignId`:

```typescript
<LayoutBlockSettings 
  block={block} 
  onUpdate={onUpdate} 
  campaignId={campaignId}  // ✅ Required for uploads
/>
```

---

## Items Array Not Displaying

### Symptoms
- Stats/features not showing
- "Items" section empty
- Can't add/remove items

### Root Causes
1. Element type is not `'items'`
2. `itemFields` missing or misconfigured
3. Content key mismatch

### Solution

**Step 1: Verify Items Element Config**

```typescript
elements: [
  {
    type: 'items',  // ✅ Must be exactly 'items'
    contentKey: 'items',  // or 'stats', 'features', etc.
    label: 'Stats Items',
    required: false,
    options: {
      itemFields: [  // ✅ Must define fields
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
      ],
    },
  },
]
```

**Step 2: Verify Default Content Structure**

Default content must be an array:

```typescript
if (variation === 'stats-3-col') {
  return {
    items: [  // ✅ Array of objects
      { value: '10K+', title: 'Users', description: 'Active' },
      { value: '99%', title: 'Uptime', description: 'Guaranteed' },
    ],
  };
}
```

**Step 3: Check Factory Renders Items Section**

The factory should automatically create a "Stats Items" collapsible section for `items` elements.

---

## Custom Controls Not Rendering

### Symptoms
- Custom select/number/checkbox not showing
- Settings panel missing custom control
- Control renders but doesn't work

### Root Cause
Custom controls not properly configured in `settingsControls.custom`.

### Solution

**Verify Custom Control Configuration**:

```typescript
settingsControls: {
  // ... other controls
  custom: [  // ✅ Array of custom controls
    {
      type: 'select',  // ✅ 'select' | 'number' | 'checkbox'
      key: 'verticalAlign',  // ✅ Unique key
      label: 'Vertical Alignment',  // ✅ Display label
      options: ['top', 'middle', 'bottom'],  // ✅ For select only
      defaultValue: 'top',  // ✅ Optional
    },
    {
      type: 'number',
      key: 'columns',
      label: 'Columns',
      min: 2,  // ✅ For number only
      max: 4,
      defaultValue: 3,
    },
    {
      type: 'checkbox',
      key: 'showBorder',
      label: 'Show Border',
      defaultValue: false,
    },
  ],
}
```

**Common Mistakes**:
- ❌ Forgetting `options` for select
- ❌ Using invalid `type` (must be 'select', 'number', or 'checkbox')
- ❌ Key conflicts with built-in settings (e.g., 'align', 'padding')

---

## Testing Checklist

Before considering a layout "complete", verify:

- [ ] Layout appears in selector
- [ ] Preview thumbnail looks correct
- [ ] All settings controls render
- [ ] Input focus doesn't jump
- [ ] Default content loads on creation
- [ ] Content changes reflect in preview
- [ ] Settings changes reflect in preview
- [ ] Switching to/from other layouts works
- [ ] HTML output is valid
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Tested in Gmail preview
- [ ] Tested in Outlook preview

---

## Getting Help

If you've tried these solutions and still have issues:

1. **Check Recent Changes**: Review git diff to see what changed
2. **Clear All Caches**: 
   ```bash
   rm -rf .next node_modules/.cache
   npm run dev
   ```
3. **Check TypeScript**: Run `npx tsc --noEmit` to find type errors
4. **Check Console**: Look for errors in browser DevTools
5. **Compare with Working Layout**: Copy structure from `hero-center` config
6. **Read Documentation**: 
   - `LAYOUT_SYSTEM_OVERVIEW.md` for architecture
   - `CONFIG_SCHEMA_REFERENCE.md` for valid options
   - `LAYOUT_EXAMPLES.md` for working examples

---

## Debug Mode

Enable debug logging in the factory:

**File**: `lib/email/blocks/renderers/layout-factory.ts`

```typescript
export function getLayoutConfig(variation: string): LayoutConfig | null {
  console.log('[DEBUG] Loading config for:', variation);  // Add this
  
  const configs: Record<string, LayoutConfig> = { /* ... */ };
  const config = configs[variation] || null;
  
  if (!config) {
    console.error('[DEBUG] Config not found for:', variation);  // Add this
  }
  
  return config;
}
```

Check browser console for debug messages.

---

## Common Patterns

### Pattern 1: Config → Types → Defaults → Test

When adding a layout:
1. ✅ Create config file
2. ✅ Add to all type definitions
3. ✅ Add default content/settings
4. ✅ Test in browser

### Pattern 2: Simple First, Complex Later

Start with factory renderer, convert to hand-written if needed.

### Pattern 3: Copy-Paste-Modify

Copy existing similar layout, modify incrementally.

---

## See Also

- **Adding Layouts**: `ADDING_NEW_LAYOUTS.md`
- **Config Reference**: `CONFIG_SCHEMA_REFERENCE.md`
- **Examples**: `LAYOUT_EXAMPLES.md`
- **System Overview**: `LAYOUT_SYSTEM_OVERVIEW.md`

