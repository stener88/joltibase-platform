# V2 Component Mapping & Toolbar Customization - Testing Guide

**Date**: 2025-11-19  
**Status**: ✅ Implementation Complete - Ready for Testing

---

## What Was Implemented

### ✅ Phase 1: Component Descriptor System
- **File**: `lib/email-v2/component-descriptor.ts`
- Maps all React Email component types to their editable properties
- Categorizes properties into: content, style, spacing
- Provides display names and icons for each component
- Determines component capabilities (canHaveChildren, canDelete, requiresContent)

### ✅ Phase 2: Toolbar Configuration
- **File**: `lib/email-v2/toolbar-config.ts`
- Defines toolbar button visibility per component type
- Customizes AI prompt placeholders based on component
- Provides quick action buttons with preset prompts
- Examples:
  - Headings/Text: Get quick actions like "Make shorter", "Expand", "Professional tone"
  - Buttons: Get "Stronger CTA", "Add urgency"
  - Layout components: Get "More spacing", "Less spacing"

### ✅ Phase 3: Component Label Badge
- **File**: `components/email-editor/visual-edits/ComponentLabel.tsx`
- Shows component type badge when selected (e.g., "📦 Container", "H Heading")
- Positioned above selected element
- Violet theme matching the selection outline

### ✅ Phase 4: Integration
- **Updated**: `components/email-editor/V2ChatEditor.tsx`
- Integrates ComponentLabel and customized FloatingToolbar
- Passes toolbar configuration based on component type
- Updated prompt helpers to use display names

- **Updated**: `components/campaigns/visual-edits/FloatingToolbar.tsx`
- Accepts optional `toolbarConfig` and `componentType` props
- Conditionally renders buttons based on config
- Shows quick action emoji buttons for preset prompts
- Backwards compatible with V1 blocks

---

## How to Test

### Prerequisites
1. Start development server: `npm run dev`
2. Have a V2 campaign created (or create one via the generator)
3. Open campaign editor: `http://localhost:3000/dashboard/campaigns/[v2-campaign-id]/edit`

### Test Procedure

#### 1. Visual Component Labels
- [ ] Toggle visual edits ON (cursor icon, bottom-left)
- [ ] Click on different components (Container, Heading, Text, Button, Section)
- [ ] Verify component label badge appears above selected element
- [ ] Verify label shows correct icon + name (e.g., "📦 Container", "H Heading", "🔘 Button")
- [ ] Verify label moves with different selections

#### 2. Toolbar Customization - Layout Components (Container, Section)

**Select a Container or Section:**
- [ ] Verify AI placeholder says "Adjust container..." or "Modify section..."
- [ ] Verify Content button (T icon) is HIDDEN
- [ ] Verify Styles button (palette) is SHOWN
- [ ] Verify Spacing button (arrows) is SHOWN
- [ ] Verify quick action buttons show: "↔️ More spacing", "↕️ Less spacing"

**Test AI refinement:**
```
Test prompts:
- "Change background to light blue"
- "Add 40px padding"
- "Make the max width 800px"
```

**Test quick actions:**
- [ ] Click "↔️ More spacing" button
- [ ] Verify it submits "Add more padding to this container"
- [ ] Click "↕️ Less spacing" button
- [ ] Verify it submits "Reduce padding on this container"

#### 3. Toolbar Customization - Text Components (Heading, Text)

**Select a Heading or Text Block:**
- [ ] Verify AI placeholder says "Edit heading text..." or "Edit text content..."
- [ ] Verify Content button (T) is SHOWN
- [ ] Verify Styles button is SHOWN
- [ ] Verify Spacing button is SHOWN
- [ ] Verify quick actions show: "✂️ Make shorter", "📝 Expand", "💼 Professional", "😊 Casual"

**Test AI refinement:**
```
Test prompts:
- "Make this text bold and larger"
- "Change color to dark blue"
- "Make the text more concise"
```

**Test quick actions:**
- [ ] Click "✂️ Make shorter"
- [ ] Verify it submits "Make this heading more concise" (or "text block" for Text)
- [ ] Click "📝 Expand"
- [ ] Verify it submits "Expand this heading with more detail"
- [ ] Click "💼 Professional tone"
- [ ] Verify it submits "Make this heading more professional"
- [ ] Click "😊 Casual tone"
- [ ] Verify it submits "Make this heading more casual and friendly"

#### 4. Toolbar Customization - Button Component

**Select a Button:**
- [ ] Verify AI placeholder says "Change button text, color, or link..."
- [ ] Verify Content button is SHOWN
- [ ] Verify Styles button is SHOWN
- [ ] Verify Spacing button is SHOWN
- [ ] Verify quick actions show: "💪 Stronger CTA", "⏰ Add urgency"

**Test AI refinement:**
```
Test prompts:
- "Change button color to green and text to 'Get Started'"
- "Make the button larger with more padding"
- "Change the link to https://example.com"
```

**Test quick actions:**
- [ ] Click "💪 Stronger CTA"
- [ ] Verify it submits "Make this button text more compelling"
- [ ] Click "⏰ Add urgency"
- [ ] Verify it submits "Add a sense of urgency to this button"

#### 5. Toolbar Customization - Image Component

**Select an Image (Img):**
- [ ] Verify AI placeholder says "Change image URL or styling..."
- [ ] Verify Content button is SHOWN
- [ ] Verify Styles button is SHOWN
- [ ] Verify Spacing button is SHOWN
- [ ] Verify NO quick actions show (images don't have preset actions)

**Test AI refinement:**
```
Test prompts:
- "Add border radius of 8px"
- "Set width to 400px"
- "Change the image to https://via.placeholder.com/600x400"
```

#### 6. Toolbar Button Click Behaviors

**Test Content button:**
- [ ] Click Content button on Heading
- [ ] Verify it inserts "Edit the content of this heading: " into chat input
- [ ] Click Content button on Button
- [ ] Verify it inserts "Edit the content of this button: " into chat input

**Test Styles button:**
- [ ] Click Styles button on any component
- [ ] Verify it inserts "Change the style of this [component]: " into chat input

**Test Spacing button:**
- [ ] Click Spacing button on any component
- [ ] Verify it inserts "Adjust padding and spacing for this [component]: " into chat input

#### 7. Delete Button

**Test deletion:**
- [ ] Select Container - verify delete button is SHOWN
- [ ] Select Heading - verify delete button is SHOWN
- [ ] Select Button - verify delete button is SHOWN
- [ ] Click delete button
- [ ] Verify component is removed from email
- [ ] Verify changes save to database

---

## AI Refinement Quality Assessment

For each component type, test and document AI quality:

### Container
**Test Prompts:**
- ✅ "Change background to light blue"
- ✅ "Add 40px padding"
- ✅ "Make max width 800px"

**Expected Behavior:**
- AI should update `props.style.backgroundColor`
- AI should update `props.style.padding`
- AI should update `props.style.maxWidth`

**Quality Notes:**
[To be filled during testing]

---

### Heading
**Test Prompts:**
- ✅ "Make the text larger and bold"
- ✅ "Change to dark blue color"
- ✅ "Center align the heading"
- ✅ "Make this more concise" (quick action)

**Expected Behavior:**
- AI should update `props.style.fontSize` and `props.style.fontWeight`
- AI should update `props.style.color`
- AI should update `props.style.textAlign`
- AI should rewrite `content` to be shorter

**Quality Notes:**
[To be filled during testing]

---

### Text
**Test Prompts:**
- ✅ "Update the paragraph to be more concise"
- ✅ "Change font size to 16px"
- ✅ "Add more line height"
- ✅ "Expand this with more detail" (quick action)

**Expected Behavior:**
- AI should rewrite `content` to be shorter
- AI should update `props.style.fontSize`
- AI should update `props.style.lineHeight`
- AI should expand `content` with more words

**Quality Notes:**
[To be filled during testing]

---

### Button
**Test Prompts:**
- ✅ "Change button color to green and text to 'Get Started'"
- ✅ "Make the button larger with more padding"
- ✅ "Change the link to https://example.com"
- ✅ "Make this button text more compelling" (quick action)

**Expected Behavior:**
- AI should update `props.style.backgroundColor` and `content`
- AI should update `props.style.padding`
- AI should update `props.href`
- AI should rewrite button `content` to be more action-oriented

**Quality Notes:**
[To be filled during testing]

---

### Image
**Test Prompts:**
- ✅ "Add border radius of 8px"
- ✅ "Set width to 400px"
- ✅ "Change alt text to 'Product photo'"

**Expected Behavior:**
- AI should update `props.style.borderRadius`
- AI should update `props.width`
- AI should update `props.alt`

**Quality Notes:**
[To be filled during testing]

---

### Section
**Test Prompts:**
- ✅ "Add light gray background"
- ✅ "Add 30px padding top and bottom"

**Expected Behavior:**
- AI should update `props.style.backgroundColor`
- AI should update `props.style.padding`

**Quality Notes:**
[To be filled during testing]

---

## Known Limitations

1. **Root elements** (Html, Head, Body) - Cannot be deleted (expected)
2. **Quick actions** - Only show for Heading, Text, Button, and layout components
3. **AI context** - AI doesn't have full email context when refining individual components
4. **Undo/Redo** - No undo for component changes yet

---

## Next Steps After Testing

Based on test results, determine:

1. **AI Quality**: Is AI accurate enough for component refinement?
   - If YES: Keep AI-only approach ✅
   - If NO: Consider adding manual UI controls (color pickers, etc.)

2. **Quick Actions**: Are the preset prompts useful?
   - If YES: Consider adding more component-specific quick actions
   - If NO: Remove or redesign quick actions

3. **Missing Features**:
   - Add Row/Column support if needed
   - Add more component types (CodeBlock, Markdown, etc.)
   - Add component duplication
   - Add component reordering (drag-and-drop)

---

## Testing Checklist Summary

- [ ] Component labels show correctly for all types
- [ ] Toolbar buttons show/hide based on component type
- [ ] AI prompt placeholders are component-specific
- [ ] Quick action buttons appear for appropriate components
- [ ] Quick actions submit correct prompts
- [ ] Content/Styles/Spacing buttons insert correct text
- [ ] AI refinement works for all component types
- [ ] Delete button works correctly
- [ ] Changes persist to database

---

**Ready for testing!** 🚀

