# Layout Examples

This document provides 4 complete, working examples showing different complexity levels of the layout system.

---

## Example 1: Hero Center (Simple Layout)

**Complexity**: ⭐ Simple  
**Renderer**: Factory-generated ✅  
**Settings**: Factory-generated ✅

### Use Case
Opening hero section for emails, product launches, announcements. Centered content in a vertical stack.

### Complete Config File

**Location**: `lib/email/blocks/configs/hero-center.ts`

```typescript
import type { LayoutConfig } from './types';

export const heroCenterConfig: LayoutConfig = {
  id: 'hero-center',
  name: 'Hero Center',
  description: 'Vertically stacked hero section with centered content',
  structure: 'single-column',
  category: 'content',
  
  elements: [
    {
      type: 'header',
      contentKey: 'header',
      label: 'Eyebrow Text',
      required: false,
      visibilityKey: 'showHeader',
      defaultVisible: true,
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Headline',
      required: true,
      visibilityKey: 'showTitle',
      defaultVisible: true,
    },
    {
      type: 'divider',
      contentKey: 'divider',
      label: 'Divider Line',
      required: false,
      visibilityKey: 'showDivider',
      defaultVisible: false,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
      visibilityKey: 'showParagraph',
      defaultVisible: true,
    },
    {
      type: 'button',
      contentKey: 'button',
      label: 'Call to Action',
      required: false,
      visibilityKey: 'showButton',
      defaultVisible: true,
      options: {
        includeUrl: true,
      },
    },
  ],
  
  settingsControls: {
    toggles: ['showHeader', 'showTitle', 'showDivider', 'showParagraph', 'showButton'],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
      { key: 'dividerColor', label: 'Divider Color', defaultValue: '#e5e7eb' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#7c3aed' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
    ],
    spacing: true,
    alignment: true,
    flip: false,
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: { top: 80, right: 40, bottom: 80, left: 40 },
    align: 'center',
    titleColor: '#111827',
    paragraphColor: '#374151',
    dividerColor: '#e5e7eb',
    titleFontSize: '32px',
    paragraphFontSize: '16px',
    buttonBackgroundColor: '#7c3aed',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'email opening',
    'major announcement',
    'centered headline',
    'product launch',
    'newsletter intro',
  ],
};
```

### Default Content

**File**: `lib/email/blocks/registry/defaults.ts`

```typescript
if (variation === 'hero-center') {
  return {
    header: 'Introducing',
    title: 'Your Headline Here',
    paragraph: 'Add your description text here.',
    button: { text: 'Get Started', url: '#' },
  };
}
```

### Generated Settings Component

The factory automatically generates:
- ✅ Text input for eyebrow text
- ✅ Text input for headline
- ✅ Text input for description
- ✅ Button text + URL inputs
- ✅ 5 visibility toggles
- ✅ 6 color pickers
- ✅ 4 padding inputs
- ✅ 3 alignment buttons

### Renderer Approach

**Factory-generated** - Simple vertical stack, no complex positioning needed.

The factory automatically creates:
```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding: [padding values]; background-color: [bg];">
      <p>[eyebrow text]</p>
      <h1>[title]</h1>
      <hr>[divider]</hr>
      <p>[paragraph]</p>
      <a>[button]</a>
    </td>
  </tr>
</table>
```

### Visual Preview

```
┌────────────────────────────────────┐
│                                    │
│         [INTRODUCING]              │
│                                    │
│     Your Headline Here             │
│     ─────────────────              │
│                                    │
│  Add your description text here.   │
│                                    │
│      [  Get Started  ]             │
│                                    │
└────────────────────────────────────┘
```

### Key Takeaways
- Simple layouts can use factory renderer
- Vertical stacks are perfect for factory automation
- All standard controls work out of the box
- No custom code needed

---

## Example 2: Two Column 60/40 (Medium Complexity)

**Complexity**: ⭐⭐ Medium  
**Renderer**: Hand-written ✅  
**Settings**: Factory-generated ✅

### Use Case
Side-by-side content with image and text. Common for product features, service descriptions.

### Complete Config File

**Location**: `lib/email/blocks/configs/two-column-60-40.ts`

```typescript
import type { LayoutConfig } from './types';

export const twoColumn6040Config: LayoutConfig = {
  id: 'two-column-60-40',
  name: 'Two Columns (60/40)',
  description: 'Side-by-side layout with 60% left, 40% right columns',
  structure: 'two-column',
  category: 'two-column',
  
  elements: [
    {
      type: 'image',
      contentKey: 'image',
      label: 'Image',
      required: false,
      options: {
        includeAltText: true,
      },
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Title',
      required: false,
      visibilityKey: 'showTitle',
      defaultVisible: true,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
      visibilityKey: 'showParagraph',
      defaultVisible: true,
    },
    {
      type: 'button',
      contentKey: 'button',
      label: 'Call to Action',
      required: false,
      visibilityKey: 'showButton',
      defaultVisible: true,
      options: {
        includeUrl: true,
      },
    },
  ],
  
  settingsControls: {
    toggles: ['showTitle', 'showParagraph', 'showButton'],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#7c3aed' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
    ],
    spacing: true,
    alignment: false,
    flip: true,  // Image left/right toggle
    custom: [
      {
        type: 'select',
        key: 'verticalAlign',
        label: 'Column Alignment',
        options: ['top', 'middle', 'bottom'],
        defaultValue: 'top',
      },
    ],
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    align: 'left',
    titleColor: '#111827',
    paragraphColor: '#374151',
    buttonBackgroundColor: '#7c3aed',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'side by side',
    'prominent content',
    '60/40 split',
    'featured image',
  ],
};
```

### Default Content

```typescript
if (variation === 'two-column-60-40') {
  return {
    image: { 
      url: 'https://placehold.co/360x240/e5e7eb/666666?text=Image', 
      altText: 'Feature image' 
    },
    title: 'Feature Headline',
    paragraph: 'Describe your product feature or service benefit here.',
    button: { text: 'Learn More', url: '#' },
  };
}
```

### Generated Settings Component

The factory generates:
- ✅ Image upload button + modal (separate section)
- ✅ Text inputs for title, paragraph
- ✅ Button text + URL inputs
- ✅ 3 visibility toggles
- ✅ 5 color pickers
- ✅ 4 padding inputs
- ✅ Flip toggle (image left/right)
- ✅ Custom vertical alignment dropdown

### Renderer Approach

**Hand-written** - Complex column width calculations, flip logic, vertical alignment.

**File**: `lib/email/blocks/renderers/layout-blocks.ts`

```typescript
export function renderTwoColumnLayout(
  content: any, 
  settings: any, 
  context: RenderContext,
  widthRatio: '60-40' | '50-50' | '40-60' | '70-30' | '30-70'
): string {
  const flip = settings.flip || false;
  const verticalAlign = settings.verticalAlign || 'top';
  
  // Calculate precise column widths accounting for padding and gap
  const { imageWidth, textWidth } = calculateColumnWidths(widthRatio);
  
  // Build image and text columns with proper spacing
  const imageHtml = renderImageColumn(content.image, imageWidth);
  const textHtml = renderTextColumn(content, settings, textWidth);
  
  // Arrange columns based on flip setting
  const leftColumn = flip ? textHtml : imageHtml;
  const rightColumn = flip ? imageHtml : textHtml;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${paddingString}; background-color: ${bgColor};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="${leftWidth}" valign="${verticalAlign}">
                ${leftColumn}
              </td>
              <td width="20"></td>
              <td width="${rightWidth}" valign="${verticalAlign}">
                ${rightColumn}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
```

**Why hand-written?**
- ✅ Precise width calculations (360px vs 220px for 60/40)
- ✅ 20px gap between columns
- ✅ Flip logic (image left/right)
- ✅ Vertical alignment (top/middle/bottom)
- ✅ Responsive to padding changes

### Visual Preview

```
┌─────────────────────────────────────┐
│  ┌──────────┐   Feature Headline    │
│  │          │                        │
│  │  Image   │   Describe your product│
│  │          │   feature or service   │
│  │          │   benefit here.        │
│  └──────────┘                        │
│                [ Learn More ]        │
└─────────────────────────────────────┘
   60%   gap   40%
```

### Key Takeaways
- Medium complexity needs hand-written renderer
- Factory still generates all settings UI
- Custom controls (dropdown) work seamlessly
- Flip toggle requires conditional HTML structure

---

## Example 3: Stats 3 Column (Complex with Items Array)

**Complexity**: ⭐⭐⭐ Complex  
**Renderer**: Hand-written ✅  
**Settings**: Factory-generated ✅

### Use Case
Display metrics, achievements, or key numbers. Dynamic array of stat items.

### Complete Config File

**Location**: `lib/email/blocks/configs/stats-3-col.ts`

```typescript
import type { LayoutConfig } from './types';

export const stats3ColConfig: LayoutConfig = {
  id: 'stats-3-col',
  name: 'Stats (3 Columns)',
  description: 'Three impressive statistics in a row',
  structure: 'multi-column',
  category: 'multi-column',
  
  elements: [
    {
      type: 'items',
      contentKey: 'items',
      label: 'Stats Items',
      required: false,
      options: {
        itemFields: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
        ],
      },
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
      { key: 'titleColor', label: 'Value Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
    ],
    spacing: true,
    alignment: false,
    flip: false,
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    titleColor: '#111827',
    paragraphColor: '#374151',
  },
  
  aiHints: [
    'three metrics',
    'key numbers',
    'statistics',
    'achievements',
  ],
};
```

### Default Content

```typescript
if (variation === 'stats-3-col') {
  return {
    items: [
      { value: '10,000+', title: 'Active Users', description: 'Growing daily' },
      { value: '99.9%', title: 'Uptime', description: 'Guaranteed' },
      { value: '24/7', title: 'Support', description: 'Always available' },
    ],
  };
}
```

### Generated Settings Component

The factory generates:
- ✅ **Dynamic Items Editor** (separate "Stats Items" section)
  - Each item has 3 fields: Value, Title, Description
  - Add/Remove buttons for items
  - Drag to reorder (future enhancement)
- ✅ 3 color pickers
- ✅ 4 padding inputs
- ✅ No toggles (stats always visible)

**Items Editor UI**:
```
Stats Items
┌─────────────────────────────────┐
│ Item 1                [Remove]  │
│ Value:      [10,000+        ]   │
│ Title:      [Active Users   ]   │
│ Description:[Growing daily  ]   │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Item 2                [Remove]  │
│ Value:      [99.9%          ]   │
│ Title:      [Uptime         ]   │
│ Description:[Guaranteed     ]   │
└─────────────────────────────────┘
         [ + Add Item ]
```

### Renderer Approach

**Hand-written** - Grid layout with equal-width columns, dynamic item count.

**File**: `lib/email/blocks/renderers/layout-blocks.ts`

```typescript
export function renderStatsLayout(
  content: any,
  settings: any,
  context: RenderContext,
  columns: 2 | 3 | 4
): string {
  const items = content.items || [];
  const columnWidth = Math.floor((600 - 40) / columns); // Account for padding
  
  // Build stat cells
  const statCells = items.slice(0, columns).map((item: any) => `
    <td width="${columnWidth}" valign="top" align="center" style="padding: 20px;">
      <div style="font-size: 36px; font-weight: 700; color: ${settings.titleColor}; margin-bottom: 8px;">
        ${escapeHtml(item.value || '')}
      </div>
      <div style="font-size: 18px; font-weight: 600; color: ${settings.titleColor}; margin-bottom: 4px;">
        ${escapeHtml(item.title || '')}
      </div>
      <div style="font-size: 14px; color: ${settings.paragraphColor};">
        ${escapeHtml(item.description || '')}
      </div>
    </td>
  `).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${paddingString}; background-color: ${bgColor};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${statCells}
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
```

**Why hand-written?**
- ✅ Dynamic number of items (2, 3, or 4 columns)
- ✅ Equal-width column calculation
- ✅ Center-aligned content per cell
- ✅ Specific typography hierarchy (value > title > description)

### Visual Preview

```
┌─────────────────────────────────────────┐
│                                         │
│   10,000+      99.9%       24/7        │
│   Active Users  Uptime     Support     │
│   Growing daily Guaranteed Always...   │
│                                         │
└─────────────────────────────────────────┘
```

### Key Takeaways
- Items array enables dynamic content lists
- Factory generates full CRUD interface for items
- Hand-written renderer handles grid layout
- Perfect for metrics, features, testimonials

---

## Example 4: Magazine Feature (Advanced Layout)

**Complexity**: ⭐⭐⭐⭐ Advanced  
**Renderer**: Hand-written ✅  
**Settings**: Factory-generated ✅

### Use Case
Editorial-style featured content with unique design. Badge overlays, specific typography.

### Complete Config File

**Location**: `lib/email/blocks/configs/magazine-feature.ts`

```typescript
import type { LayoutConfig } from './types';

export const magazineFeatureConfig: LayoutConfig = {
  id: 'magazine-feature',
  name: 'Magazine Feature',
  description: 'Editorial-style vertical layout with featured image',
  structure: 'single-column',
  category: 'advanced',
  
  elements: [
    {
      type: 'title',
      contentKey: 'title',
      label: 'Title',
      required: false,
    },
    {
      type: 'image',
      contentKey: 'image',
      label: 'Featured Image',
      required: false,
      options: {
        includeAltText: true,
      },
    },
    {
      type: 'badge',
      contentKey: 'badge',
      label: 'Badge/Number',
      required: false,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: '#9CADB7' },
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#111827' },
    ],
    spacing: true,
    alignment: false,
    flip: false,
  },
  
  defaults: {
    backgroundColor: '#9CADB7',
    padding: { top: 60, right: 40, bottom: 60, left: 40 },
    titleColor: '#111827',
    paragraphColor: '#111827',
    titleFontSize: '48px',
  },
  
  aiHints: [
    'magazine style',
    'editorial',
    'featured article',
    'vertical layout',
  ],
};
```

### Default Content

```typescript
if (variation === 'magazine-feature') {
  return {
    title: 'Feature Story',
    image: { 
      url: 'https://placehold.co/400x400/9CADB7/111827?text=Feature', 
      altText: 'Magazine feature' 
    },
    badge: '01',
    paragraph: 'An in-depth look at our latest innovation and what it means for the industry.',
  };
}
```

### Generated Settings Component

The factory generates:
- ✅ Text input for title
- ✅ Image upload for featured image (separate section)
- ✅ Text input for badge/number
- ✅ Text input for paragraph
- ✅ 3 color pickers
- ✅ 4 padding inputs
- ✅ No toggles (all elements always visible)

### Renderer Approach

**Hand-written** - Unique editorial design with badge positioning, specific typography, square image.

**File**: `lib/email/blocks/renderers/advanced-layouts.ts`

```typescript
export function renderMagazineFeatureLayout(
  content: any,
  settings: any,
  context: RenderContext
): string {
  const title = content.title || '';
  const image = content.image;
  const badge = content.badge || '';
  const paragraph = content.paragraph || '';
  
  // Large title at top
  const titleHtml = title ? `
    <h2 style="margin: 0 0 30px 0; font-size: 48px; font-weight: 700; color: ${settings.titleColor}; line-height: 1.1; text-align: left;">
      ${escapeHtml(title)}
    </h2>
  ` : '';
  
  // Square image (400x400)
  const imageHtml = image?.url ? `
    <div style="margin-bottom: 20px;">
      <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText || '')}" 
           style="display: block; width: 400px; height: 400px; object-fit: cover; border: none;" />
    </div>
  ` : '';
  
  // Badge with special styling
  const badgeHtml = badge ? `
    <div style="display: inline-block; padding: 8px 16px; background: rgba(0,0,0,0.1); border-radius: 4px; font-size: 24px; font-weight: 700; margin-bottom: 15px;">
      ${escapeHtml(badge)}
    </div>
  ` : '';
  
  // Description with specific line height
  const paragraphHtml = paragraph ? `
    <p style="margin: 0; font-size: 16px; line-height: 1.8; color: ${settings.paragraphColor}; text-align: left;">
      ${escapeHtml(paragraph)}
    </p>
  ` : '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${paddingString}; background-color: ${settings.backgroundColor};">
          ${titleHtml}
          ${imageHtml}
          ${badgeHtml}
          ${paragraphHtml}
        </td>
      </tr>
    </table>
  `;
}
```

**Why hand-written?**
- ✅ Unique typography (48px title, specific line-height)
- ✅ Fixed square image dimensions (400x400)
- ✅ Badge with custom background overlay
- ✅ Left-aligned content (not centered)
- ✅ Specific spacing between elements

### Visual Preview

```
┌─────────────────────────────────────┐
│                                     │
│  Feature Story                      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │        Featured Image         │ │
│  │         (Square)              │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ 01 ]                             │
│                                     │
│  An in-depth look at our latest     │
│  innovation and what it means...    │
│                                     │
└─────────────────────────────────────┘
```

### Key Takeaways
- Advanced layouts benefit from hand-written renderers
- Factory still handles all settings UI automatically
- Unique designs require specific HTML structure
- Badge element demonstrates custom styling

---

## Comparison Table

| Layout | Complexity | Renderer | Settings | Elements | Custom Controls | Items Array |
|--------|-----------|----------|----------|----------|-----------------|-------------|
| Hero Center | ⭐ Simple | Factory | Factory | 5 | No | No |
| Two Column 60/40 | ⭐⭐ Medium | Hand-written | Factory | 4 | Yes (dropdown) | No |
| Stats 3 Column | ⭐⭐⭐ Complex | Hand-written | Factory | 1 | No | Yes |
| Magazine Feature | ⭐⭐⭐⭐ Advanced | Hand-written | Factory | 4 | No | No |

---

## When to Use Each Approach

### Factory Renderer (Simple Layouts)
- ✅ Vertical stacks
- ✅ Centered content
- ✅ No complex positioning
- ✅ Standard element order

**Examples**: hero-center, simple announcements

### Hand-Written Renderer (Complex Layouts)
- ✅ Multi-column layouts
- ✅ Precise width calculations
- ✅ Custom positioning (overlays, absolute)
- ✅ Dynamic item arrays
- ✅ Unique typography/spacing

**Examples**: two-column, stats, image-overlay, magazine

### Factory Settings (All Layouts)
- ✅ Always use factory for settings
- ✅ Consistent UI patterns
- ✅ Automatic control rendering
- ✅ Easy to maintain

---

## See Also

- **Adding Layouts**: `ADDING_NEW_LAYOUTS.md`
- **Config Reference**: `CONFIG_SCHEMA_REFERENCE.md`
- **System Overview**: `LAYOUT_SYSTEM_OVERVIEW.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

