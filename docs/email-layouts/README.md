# Email Layouts Documentation

Complete documentation for the Designer-Ready Layout System.

## Overview

The Designer-Ready Layout System is a factory pattern-based architecture that automatically generates React settings components and HTML renderers from TypeScript configuration files. This reduces the code needed for each layout by 95% and enables consistent, maintainable email layouts.

## Quick Start

**For Developers Adding New Layouts**: Read [`ADDING_NEW_LAYOUTS.md`](./ADDING_NEW_LAYOUTS.md)

**For Understanding the System**: Read [`LAYOUT_SYSTEM_OVERVIEW.md`](./LAYOUT_SYSTEM_OVERVIEW.md)

**For Reference**: See [`CONFIG_SCHEMA_REFERENCE.md`](./CONFIG_SCHEMA_REFERENCE.md)

**For Examples**: See [`LAYOUT_EXAMPLES.md`](./LAYOUT_EXAMPLES.md)

**For Troubleshooting**: See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)

## Documentation Index

### 1. [Layout System Overview](./LAYOUT_SYSTEM_OVERVIEW.md)
**Read this first to understand the architecture**

- What the factory system is and why it exists
- Benefits: 95% less code, consistent patterns, faster development
- Architecture diagram and flow
- Hybrid approach: Factory settings for all, factory renderers for simple layouts
- Key files and their roles
- Implementation status (14 layouts)

### 2. [Adding New Layouts](./ADDING_NEW_LAYOUTS.md)
**Step-by-step guide for developers**

- Prerequisites and requirements
- 9-step process with code examples
- Common pitfalls and solutions
- Testing checklist
- File checklist (which files to touch)
- Time estimate: 20-30 minutes for simple layouts

### 3. [Config Schema Reference](./CONFIG_SCHEMA_REFERENCE.md)
**Complete reference for all configuration options**

- `LayoutConfig` interface breakdown
- All available element types (10 types)
- All settings controls (toggles, colors, spacing, alignment, flip, custom)
- Default values and recommended color palette
- Validation and best practices
- Complete working example

### 4. [Layout Examples](./LAYOUT_EXAMPLES.md)
**4 complete, working examples**

- Example 1: Hero Center (Simple - Factory renderer)
- Example 2: Two Column 60/40 (Medium - Hand-written renderer)
- Example 3: Stats 3 Column (Complex - Items array)
- Example 4: Magazine Feature (Advanced - Unique design)
- Each example includes complete config, defaults, and renderer code
- Comparison table and decision guide

### 5. [Troubleshooting](./TROUBLESHOOTING.md)
**Common issues and solutions**

- Layout not appearing in selector
- Settings panel empty or missing controls
- Input focus loss
- Default content not loading
- Renderer not working
- TypeScript errors
- Preview inaccuracies
- Image upload issues
- Items array not displaying
- Custom controls not rendering
- Debug mode and testing checklist

## Key Concepts

### Factory Pattern
The system uses a factory pattern to generate React components and HTML renderers from TypeScript configs, eliminating repetitive hand-written code.

### Hybrid Architecture
- **Factory Settings** (All layouts): Consistent UI, automatic control rendering
- **Factory Renderers** (Simple layouts only): Automatic HTML generation
- **Hand-Written Renderers** (Complex layouts): Precise control for advanced positioning

### TypeScript Configs
Configs are written in TypeScript (not JSON) for:
- Type safety and IDE autocomplete
- Inline comments and documentation
- Import/export capability
- Compile-time validation

## Current Implementation

### 14 Fully Implemented Layouts

**Hero & Content (1)**
- `hero-center` - Factory renderer

**Two-Column (6)**
- `two-column-50-50`, `two-column-60-40`, `two-column-40-60`
- `two-column-70-30`, `two-column-30-70`, `two-column-text`
- Hand-written renderers

**Stats (3)**
- `stats-2-col`, `stats-3-col`, `stats-4-col`
- Hand-written renderers with items arrays

**Advanced (4)**
- `image-overlay`, `card-centered`, `compact-image-text`, `magazine-feature`
- Hand-written renderers

### Key Achievements
- ✅ 95% reduction in code per layout
- ✅ Consistent settings UI across all layouts
- ✅ Type-safe configuration system
- ✅ Default content and styling for all layouts
- ✅ Support for 10 element types
- ✅ Custom controls (select, number, checkbox)
- ✅ Dynamic items arrays for grids/lists
- ✅ Image upload integration
- ✅ Proper email compatibility (600px, table-based)

## Architecture at a Glance

```
Configuration Layer
  lib/email/blocks/configs/*.ts
  └─> TypeScript config files define structure
         ↓
Factory Layer
  lib/email/blocks/renderers/layout-factory.ts
  └─> Generates settings components & renderers
         ↓
Renderer Layer
  lib/email/blocks/renderers/layout-blocks.ts
  └─> Produces email-compatible HTML
         ↓
UI Layer
  components/email-editor/settings/
  └─> Visual editor integration
```

## Quick Reference

### Adding a New Layout (Checklist)

1. ✅ Create config in `lib/email/blocks/configs/`
2. ✅ Register in `layout-factory.ts`
3. ✅ Add to `LayoutVariation` type
4. ✅ Add display name to `getLayoutVariationDisplayName()`
5. ✅ Add to Zod schema in `schemas.ts`
6. ✅ Add default content in `defaults.ts`
7. ✅ Add default settings in `defaults.ts`
8. ✅ Add metadata in `variations.ts`
9. ⚠️ (Optional) Create hand-written renderer for complex layouts
10. ✅ Test in browser

Time: **20-30 minutes**

### Element Types Available

- `header` - Eyebrow text
- `title` - Main headline
- `subtitle` - Subheading
- `paragraph` - Body text
- `text-area` - Multi-line text
- `button` - CTA with URL
- `badge` - Label/tag
- `image` - Image upload
- `items` - Dynamic array (for grids/stats)
- `divider` - Horizontal line

### Settings Controls Available

- `toggles` - Show/hide elements
- `colors` - Color pickers
- `spacing` - Padding controls
- `alignment` - Text alignment
- `flip` - Flip layout orientation
- `custom` - Custom controls (select, number, checkbox)

## Performance

- **Settings Components**: Memoized with `useMemo` to prevent recreation
- **Render Functions**: Pure functions, no side effects
- **Type Checking**: Compile-time only, zero runtime cost
- **Bundle Size**: Factory code smaller than 14 hand-written components

## Maintenance

The factory system is self-documenting:
- Configs are the documentation
- TypeScript types enforce correctness
- Single file per layout for isolation
- Clear separation of concerns

Adding features (e.g., new control types) requires updating:
1. `types.ts` - Add to interface
2. `layout-factory.ts` - Add rendering logic
3. Done! All 14 layouts get the feature automatically

## Best Practices

### When to Use Factory Renderer
- ✅ Vertical stacks
- ✅ Centered content
- ✅ No complex positioning
- ✅ Standard element order

### When to Use Hand-Written Renderer
- ✅ Multi-column layouts
- ✅ Precise width calculations
- ✅ Custom positioning (overlays, absolute)
- ✅ Dynamic item arrays
- ✅ Unique typography/spacing

### Always Use Factory Settings
- ✅ All layouts use factory settings
- ✅ Consistent UI patterns
- ✅ Automatic control rendering
- ✅ Easy to maintain

## Getting Help

1. **Check Documentation**: Start with `LAYOUT_SYSTEM_OVERVIEW.md`
2. **See Examples**: Reference `LAYOUT_EXAMPLES.md`
3. **Troubleshoot**: Check `TROUBLESHOOTING.md`
4. **Config Reference**: Look up options in `CONFIG_SCHEMA_REFERENCE.md`
5. **Copy Existing**: Use similar layout as template

## Contributing

When adding new layouts:
1. Follow the 9-step process in `ADDING_NEW_LAYOUTS.md`
2. Test thoroughly using the checklist in `TROUBLESHOOTING.md`
3. Update AI prompts if layout should be AI-generatable
4. Consider whether the layout needs a hand-written renderer

## Future Enhancements

Potential improvements (out of current scope):
- Visual UI for creating config files (no-code layout builder)
- Library of 20+ additional pre-built layouts
- Live preview tool for testing configs
- Automated testing for all configs
- Export/import layout configs between projects
- Drag-to-reorder for items arrays
- Conditional element visibility based on other settings

## Version History

- **Phase 1** (Complete): Core factory with hero-center proof of concept
- **Phase 2** (Complete): All 14 layouts using factory settings, button styling, vertical alignment
- **Phase 3** (Complete): Type definition cleanup, default content/styling improvements
- **Phase 4** (Complete): Comprehensive documentation

## Related Documentation

- **Project Root**: `PHASE_2_COMPLETION_SUMMARY.md` - Phase 2 implementation details
- **Configs**: `lib/email/blocks/configs/types.ts` - TypeScript interfaces
- **Renderers**: `lib/email/blocks/renderers/layout-factory.ts` - Factory implementation

---

**Last Updated**: Phase 4 Complete  
**Total Layouts**: 14  
**Code Reduction**: 95%  
**Time to Add Layout**: 20-30 minutes

