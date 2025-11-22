# Quick Guide: Adding New Templates

## Step-by-Step Process

### 1. Add HTML Template

Place your HTML file in the appropriate directory:

```bash
lib/email-v2/templates/{blockType}/{variant}.html
```

**Example:**
```bash
lib/email-v2/templates/hero/centered.html
```

### 2. Update Template Registry

The registry is already configured with all 59 templates. Just verify your template path matches the registry in `lib/email-v2/template-registry.ts`.

### 3. Create Mapping Config

Create a new file: `lib/email-v2/template-mappings/{blockType}.ts`

**Template:**

```typescript
import { registerMapping, type TemplateMapping } from './types';

// Mapping for {blockType}/{variant}
const {variant}Mapping: TemplateMapping = {
  blockType: '{blockType}',
  variant: '{variant}',
  description: 'Description of this template',
  mappings: [
    // Simple content mapping
    {
      selector: 'h1',  // CSS selector to find element
      content: 'headline',  // Path in block data
    },
    
    // Attribute mapping
    {
      selector: 'img',
      attributes: [
        { attribute: 'src', valuePath: 'imageUrl' },
        { attribute: 'alt', valuePath: 'imageAlt' },
      ],
    },
    
    // Repeating elements (arrays)
    {
      selector: 'li',
      repeat: true,
      arrayPath: 'items',  // Array in block data
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'text',
      },
    },
  ],
};

// Register the mapping
registerMapping({variant}Mapping);

// Export for documentation
export { {variant}Mapping };
```

### 4. Register in Index

Add to `lib/email-v2/template-mappings/index.ts`:

```typescript
export * from './{blockType}';
```

### 5. Test

Create a test in `lib/email-v2/test-template-system.ts` or test manually:

```typescript
import { renderBlockToHTML } from '@/lib/email-v2/template-engine';

const block = {
  blockType: '{blockType}',
  variant: '{variant}',
  // ... your block data
};

const html = renderBlockToHTML(block, settings);
console.log(html);
```

## Common Mapping Patterns

### Text Content

```typescript
{
  selector: 'h1',
  content: 'headline',  // block.headline
}
```

### Nested Properties

```typescript
{
  selector: 'img',
  attributes: [
    { attribute: 'src', valuePath: 'logo.url' },  // block.logo.url
  ],
}
```

### Multiple Attributes

```typescript
{
  selector: 'a',
  attributes: [
    { attribute: 'href', valuePath: 'ctaUrl' },
    { attribute: 'target', valuePath: 'target' },
  ],
  content: 'ctaText',
}
```

### Repeating Elements (Lists)

```typescript
{
  selector: 'table tr',  // Finds all <tr> elements
  repeat: true,
  arrayPath: 'features',  // block.features array
  itemMappings: {
    attributes: [
      { attribute: 'data-id', valuePath: 'id' },  // feature.id
    ],
    content: 'title',  // feature.title
  },
}
```

### Conditional Content

If a value doesn't exist in block data, the mapping is skipped automatically.

## CSS Selector Examples

| Selector | What it matches |
|----------|----------------|
| `img` | All `<img>` tags |
| `img[alt*="logo"]` | Images with "logo" in alt text |
| `a[href]` | All links with href attribute |
| `h1, h2, h3` | All heading tags |
| `table td a` | Links inside table cells |
| `.class-name` | Not supported (use attribute selectors) |

## Troubleshooting

### Template Not Loading

```typescript
import { templateExists } from '@/lib/email-v2/template-registry';

console.log(templateExists('hero', 'centered'));  // Should be true
```

### Mapping Not Working

1. Check selector matches your HTML
2. Verify valuePath matches your block data structure
3. Check browser console for warnings

### Content Not Injecting

```typescript
// Enable debug logging
console.log('[TemplateEngine] ...');  // Already in code

// Check your block data structure
console.log(JSON.stringify(block, null, 2));
```

## Block Type Reference

All semantic block types and their expected variants:

| Block Type | Default Variant | Other Variants |
|------------|----------------|----------------|
| header | centered-menu | side-menu, social-icons |
| hero | centered | split |
| features | grid | list, numbered, icons-2col, icons-centered |
| content | image-top | image-left, image-right, image-bottom |
| testimonial | centered | large-avatar |
| cta | primary | secondary, outline |
| footer | one-column | two-column |
| gallery | grid-2x2 | 3-column, horizontal-split, vertical-split |
| stats | simple | stepped |
| pricing | simple | two-tier |
| article | image-top | image-right, image-background, two-cards, single-author, multiple-authors |
| list | numbered | image-left |
| ecommerce | single | image-left, 3-column, 4-grid, checkout |
| marketing | bento-grid | - |
| feedback | simple-rating | survey, customer-reviews |

## Need Help?

1. Look at the header example: `lib/email-v2/template-mappings/header.ts`
2. Check template engine code: `lib/email-v2/template-engine.ts`
3. Run tests: `lib/email-v2/test-template-system.ts`

