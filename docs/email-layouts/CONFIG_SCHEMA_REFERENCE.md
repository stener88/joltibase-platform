# Config Schema Reference

Complete reference for `LayoutConfig` interface and all available options.

## LayoutConfig Interface

```typescript
interface LayoutConfig {
  id: string;                           // Unique identifier matching LayoutVariation
  name: string;                         // Display name
  description: string;                  // Developer-friendly description
  elements: LayoutElement[];            // UI elements (content fields)
  settingsControls: LayoutSettingsControls;  // Settings panel controls
  defaults: DefaultValues;              // Default styling values
}
```

---

## Elements Array

Defines content fields that appear in the settings panel.

### Element Structure

```typescript
interface LayoutElement {
  type: ElementType;          // Type of element
  contentKey: string;         // Key in content object
  label: string;             // Label in settings UI
  required?: boolean;        // Is this field required?
  options?: ElementOptions;  // Type-specific options
}
```

### Available Element Types

#### 1. `header` - Eyebrow Text

Small text above the title.

```typescript
{
  type: 'header',
  contentKey: 'header',
  label: 'Eyebrow Text',
  required: false,
}
```

**Renders**: Text input

**Content**: `string`

---

#### 2. `title` - Main Headline

Primary heading for the layout.

```typescript
{
  type: 'title',
  contentKey: 'title',
  label: 'Headline',
  required: true,
}
```

**Renders**: Text input

**Content**: `string`

---

#### 3. `subtitle` - Secondary Heading

Subheading below title.

```typescript
{
  type: 'subtitle',
  contentKey: 'subtitle',
  label: 'Subheading',
  required: false,
}
```

**Renders**: Text input

**Content**: `string`

---

#### 4. `paragraph` - Body Text

Main description or body text.

```typescript
{
  type: 'paragraph',
  contentKey: 'paragraph',
  label: 'Description',
  required: false,
}
```

**Renders**: Text input

**Content**: `string`

---

#### 5. `text-area` - Multi-line Text

For longer text content.

```typescript
{
  type: 'text-area',
  contentKey: 'longText',
  label: 'Long Description',
  required: false,
  options: {
    rows: 6,  // Number of visible rows
  },
}
```

**Renders**: Textarea

**Content**: `string`

**Options**:
- `rows?: number` - Height in rows (default: 4)

---

#### 6. `button` - Call to Action

Button with text and URL.

```typescript
{
  type: 'button',
  contentKey: 'button',
  label: 'Call to Action',
  required: false,
  options: {
    includeUrl: true,  // Show URL input
  },
}
```

**Renders**: Text input + URL input (if `includeUrl`)

**Content**: `{ text: string; url: string; }`

**Options**:
- `includeUrl?: boolean` - Show URL field (default: true)

---

#### 7. `badge` - Label/Tag

Small badge or label text.

```typescript
{
  type: 'badge',
  contentKey: 'badge',
  label: 'Badge Text',
  required: false,
}
```

**Renders**: Text input

**Content**: `string`

---

#### 8. `image` - Image Upload

Single image with upload capability.

```typescript
{
  type: 'image',
  contentKey: 'image',
  label: 'Hero Image',
  required: false,
}
```

**Renders**: Image upload button + modal

**Content**: `{ url: string; altText: string; }`

---

#### 9. `items` - Array of Items

For grids, lists, or repeated content (e.g., stats, features).

```typescript
{
  type: 'items',
  contentKey: 'stats',
  label: 'Statistics',
  required: false,
  options: {
    itemFields: [
      { key: 'value', label: 'Stat Value', type: 'text' },
      { key: 'title', label: 'Stat Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
}
```

**Renders**: Dynamic item editor with add/remove buttons

**Content**: `Array<{ [key]: string }>`

**Options**:
- `itemFields: Array<{ key: string; label: string; type: 'text' | 'textarea' }>` - Fields per item

**Example Content**:
```typescript
{
  stats: [
    { value: '10K+', title: 'Users', description: 'Active monthly users' },
    { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
  ]
}
```

---

#### 10. `divider` - Horizontal Line

Visual divider (no content input, controlled by toggle).

```typescript
{
  type: 'divider',
  contentKey: 'divider',
  label: 'Divider Line',
  required: false,
}
```

**Renders**: Toggle in settings (no content input)

**Content**: `boolean` (controlled by `showDivider` toggle)

---

## Settings Controls

Defines controls that appear in the settings panel.

```typescript
interface LayoutSettingsControls {
  toggles?: string[];                    // Visibility toggles
  colors?: LayoutColorControl[];         // Color pickers
  spacing?: boolean;                     // Padding controls
  alignment?: boolean;                   // Text alignment
  flip?: boolean;                        // Flip layout orientation
  custom?: LayoutCustomControl[];        // Custom controls
}
```

### 1. Toggles

Show/hide toggles for elements.

```typescript
toggles: ['showHeader', 'showTitle', 'showParagraph', 'showButton', 'showDivider']
```

**Renders**: Checkboxes

**Convention**: Use `show{ElementName}` pattern

---

### 2. Colors

Color picker controls.

```typescript
colors: [
  { key: 'backgroundColor', label: 'Background Color' },
  { key: 'titleColor', label: 'Title Color' },
  { key: 'paragraphColor', label: 'Text Color' },
  { key: 'dividerColor', label: 'Divider Color' },
  { key: 'buttonBackgroundColor', label: 'Button Color' },
  { key: 'buttonTextColor', label: 'Button Text Color' },
]
```

**Renders**: Color pickers with hex input

**Common Color Keys**:
- `backgroundColor` - Block background
- `titleColor` - Heading color
- `paragraphColor` - Body text color
- `dividerColor` - Divider line color
- `buttonBackgroundColor` - Button background
- `buttonTextColor` - Button text

---

### 3. Spacing

Padding controls (top, right, bottom, left).

```typescript
spacing: true
```

**Renders**: Four number inputs for padding

**Settings Key**: `padding: { top, right, bottom, left }`

---

### 4. Alignment

Text alignment controls.

```typescript
alignment: true
```

**Renders**: Three buttons (left, center, right)

**Settings Key**: `align: 'left' | 'center' | 'right'`

---

### 5. Flip

Flip layout orientation (e.g., image left → image right).

```typescript
flip: true
```

**Renders**: Toggle switch

**Settings Key**: `flip: boolean`

---

### 6. Custom Controls

Add custom input types beyond the standard controls.

#### Checkbox

```typescript
custom: [
  {
    type: 'checkbox',
    key: 'showBorder',
    label: 'Show Border',
    defaultValue: false,
  }
]
```

#### Select Dropdown

```typescript
custom: [
  {
    type: 'select',
    key: 'verticalAlign',
    label: 'Vertical Alignment',
    options: ['top', 'middle', 'bottom'],
    defaultValue: 'top',
  }
]
```

#### Number Input

```typescript
custom: [
  {
    type: 'number',
    key: 'columns',
    label: 'Number of Columns',
    min: 2,
    max: 4,
    defaultValue: 3,
  }
]
```

**Custom Control Interface**:
```typescript
{
  type: 'checkbox' | 'select' | 'number';
  key: string;
  label: string;
  options?: string[];        // For 'select'
  defaultValue?: any;
  placeholder?: string;
  min?: number;              // For 'number'
  max?: number;              // For 'number'
}
```

---

## Defaults

Default styling values applied when layout is created.

```typescript
interface DefaultValues {
  backgroundColor?: string;
  padding?: { top: number; right: number; bottom: number; left: number; };
  align?: 'left' | 'center' | 'right';
  titleColor?: string;
  paragraphColor?: string;
  dividerColor?: string;
  titleFontSize?: string;
  paragraphFontSize?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  buttonFontSize?: string;
}
```

### Common Default Values

```typescript
defaults: {
  // Background
  backgroundColor: '#ffffff',
  
  // Spacing
  padding: { top: 40, right: 20, bottom: 40, left: 20 },
  
  // Alignment
  align: 'center',
  
  // Colors
  titleColor: '#000000',
  paragraphColor: '#374151',
  dividerColor: '#d17655',
  
  // Typography
  titleFontSize: '32px',
  paragraphFontSize: '16px',
  
  // Button Styling
  buttonBackgroundColor: '#000000',
  buttonTextColor: '#ffffff',
  buttonBorderRadius: '6px',
  buttonFontSize: '16px',
}
```

### Recommended Color Palette

Based on current system defaults:

**Backgrounds**:
- `#ffffff` - White
- `#eeecea` - Light grey (stats)
- `#ded9d5` - Taupe (cards)
- `#9CADB7` - Blue-grey (magazine)

**Buttons**:
- Background: `#000000` (black)
- Text: `#ffffff` (white)

**Accent Colors**:
- `#d17655` - Coral
- `#efd897` - Gold
- `#ded9d5` - Taupe
- `#366460` - Teal

---

## Complete Example: Two-Column Layout

```typescript
import { LayoutConfig } from './types';

export const twoColumn6040Config: LayoutConfig = {
  id: 'two-column-60-40',
  name: 'Two Column (60/40)',
  description: 'Two columns with 60% image, 40% text',
  
  elements: [
    {
      type: 'image',
      contentKey: 'image',
      label: 'Feature Image',
      required: false,
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Headline',
      required: false,
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
    colors: [
      { key: 'backgroundColor', label: 'Background Color' },
      { key: 'titleColor', label: 'Title Color' },
      { key: 'paragraphColor', label: 'Text Color' },
      { key: 'buttonBackgroundColor', label: 'Button Color' },
      { key: 'buttonTextColor', label: 'Button Text Color' },
    ],
    spacing: true,
    flip: true,
    custom: [
      {
        type: 'select',
        key: 'verticalAlign',
        label: 'Vertical Alignment',
        options: ['top', 'middle', 'bottom'],
        defaultValue: 'top',
      },
    ],
  },
  
  defaults: {
    backgroundColor: '#ffffff',
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    align: 'center',
    titleColor: '#000000',
    paragraphColor: '#374151',
    titleFontSize: '28px',
    paragraphFontSize: '16px',
    buttonBackgroundColor: '#000000',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: '6px',
    buttonFontSize: '16px',
  }
};
```

---

## Validation

The factory automatically validates:
- ✅ Element `contentKey` must be unique
- ✅ Color controls reference valid keys
- ✅ Toggle controls match `show{ElementName}` pattern
- ✅ Custom control keys don't conflict with built-in keys

**TypeScript provides compile-time validation** for:
- ✅ Valid element types
- ✅ Valid setting control types
- ✅ Correct option structures

---

## Best Practices

### Element Order
Order elements as they appear visually (top to bottom):
```typescript
elements: [
  { type: 'badge', ... },      // Top
  { type: 'title', ... },
  { type: 'paragraph', ... },
  { type: 'button', ... },     // Bottom
]
```

### Content Keys
Use descriptive, lowercase keys:
- ✅ `title`, `paragraph`, `button`, `features`
- ❌ `txt`, `btn`, `data`

### Toggle Naming
Always use `show{ElementName}` pattern:
- ✅ `showTitle`, `showButton`
- ❌ `displayTitle`, `titleVisible`

### Color Keys
Use descriptive compound names:
- ✅ `backgroundColor`, `titleColor`, `buttonBackgroundColor`
- ❌ `bg`, `color1`, `btnBg`

### Font Sizes
Use px units with strings:
- ✅ `'16px'`, `'32px'`
- ❌ `16`, `'1.5rem'`

### Padding
Always provide all four values:
```typescript
padding: { top: 40, right: 20, bottom: 40, left: 20 }
```

---

## See Also

- **Adding Layouts**: `ADDING_NEW_LAYOUTS.md`
- **Examples**: `LAYOUT_EXAMPLES.md`
- **System Overview**: `LAYOUT_SYSTEM_OVERVIEW.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

