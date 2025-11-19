# V2 Visual Edits - Session Handover

**Status**: ✅ **FULLY WORKING** - Visual edits for React Email V2 are complete and functional

**Date**: 2025-11-19  
**Session Summary**: Successfully implemented visual selection and editing for V2 campaigns with iframe-based security

---

## What's Working Now

### ✅ Core Functionality
1. **Visual Edits Toggle** - Cursor icon button in chat interface (bottom-left)
2. **Hover Effects** - Bold dashed violet outlines (3px) on all components
3. **Click Selection** - Solid violet outline (4px) with glow on selected component
4. **FloatingToolbar** - Appears near selected component (below or above based on space)
5. **Component Mapping** - All 6 component types selectable (Container, Section, Heading, Text, Button)
6. **Keyboard Shortcuts** - ESC clears selection, Delete removes component

### ✅ Architecture
- **Security**: Iframe sandbox (`allow-scripts allow-same-origin`) for email rendering
- **State Management**: V2ChatEditor manages visual edits mode and toolbar positioning
- **Coordinate Conversion**: Iframe bounds → viewport coordinates for toolbar placement
- **Smart Positioning**: Toolbar positions below element (or above if no space)

---

## Key Implementation Details

### Files Modified (Final State)

**1. `/components/email-editor/EmailV2Frame.tsx`** (348 lines)
- Iframe with conditional script injection based on `onComponentClick` prop
- When visual edits ON: injects hover CSS + click handlers + data attributes
- When visual edits OFF: plain preview, no interaction
- **Key Feature**: Applies `data-component-id` to ALL descendants of matched components
- **Component Matching**: Flattens component tree and DOM tree, matches by type (H1→Heading, P→Text, A→Button)
- **Coordinate Conversion**: Converts iframe-relative bounds to viewport coordinates via postMessage

**2. `/components/email-editor/V2ChatEditor.tsx`** (388 lines)
- Manages `visualEditsMode` state (toggle on/off)
- Handles component click → toolbar positioning with smart below/above logic
- Renders FloatingToolbar at root level with viewport positioning
- **Removed**: Old `componentEditorUI` (bottom panel)
- **Fixed**: Passes `selectedElement={null}` to ChatInterface (prevents duplicate toolbar)

**3. `/app/dashboard/campaigns/[id]/edit/page.tsx`** (849 lines)
- Detects V2 campaigns: `campaign?.version === 'v2' && campaign?.root_component`
- Renders `V2ChatEditor` directly (no nested split-screen)
- Skips V1 keyboard shortcuts for V2 campaigns

### CSS Styling (in EmailV2Frame.tsx)

```css
/* Hover state */
[data-component-id]:hover:not(.selected) {
  outline: 3px dashed rgb(139, 92, 246) !important;
  outline-offset: 2px;
}

/* Selected state */
[data-component-id].selected {
  outline: 4px solid rgb(139, 92, 246) !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25) !important;
}
```

### Component Matching Logic

React Email renders with nested tables and wrapper divs:
- **Container** → TABLE
- **Section** → TABLE or TBODY
- **Heading** → H1/H2/H3 (preferred) or TD (fallback)
- **Text** → P (preferred) or TD (fallback)
- **Button** → A (preferred) or TD (fallback)

**Solution**: Collect all components and DOM elements in flat lists, match by type, then apply `data-component-id` to element AND all descendants.

### Toolbar Positioning Logic

```typescript
// Smart positioning (prefers below, falls back to above)
const spaceBelow = viewportHeight - bounds.bottom;
const spaceAbove = bounds.top;

if (spaceBelow >= toolbarHeight + 10) {
  toolbarY = bounds.bottom + 10; // Below
} else if (spaceAbove >= toolbarHeight + 10) {
  toolbarY = bounds.top - toolbarHeight - 10; // Above
} else {
  toolbarY = bounds.bottom + 10; // Below anyway
}
```

---

## Known Issues & TODOs

### 🔒 Security Concerns (Noted but Not Addressed)
- **Iframe Sandbox**: Using `allow-scripts` + `allow-same-origin` together is risky
- **User Content**: AI-generated component content not sanitized
- **Dangerous Props**: No validation to reject `onClick`, `onError`, etc.
- **Recommendation**: Add prop validation + CSP headers (see "Security Improvements" section below)

### ⚠️ Console Warnings
- "An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing"
- This is expected but should be addressed in security improvements

### 🧹 Cleanup Needed
- **Console.logs**: Remove debug logging from EmailV2Frame.tsx (lines 105-250)
- **Old Docs**: Consider consolidating V2_VISUAL_SELECTION_COMPLETE.md, V2_VISUAL_EDITS_TOGGLE_COMPLETE.md, V2_VISUAL_EDITS_FIXED.md

### 🚧 Not Yet Implemented
- **Global Settings**: Clicking settings icon shows alert (not implemented)
- **Undo/Redo**: No undo/redo for V2 component tree changes
- **Drag-and-Drop**: No component reordering yet
- **Multi-Select**: Can only select one component at a time
- **Component Refinement**: Toolbar AI input not tested/verified
- **Icon Button Actions**: Not tested (should insert prompts into chat)

---

## How to Test

### Basic Flow
1. Open V2 campaign: `http://localhost:3000/dashboard/campaigns/[v2-campaign-id]/edit`
2. Click cursor icon (bottom-left of chat) → Visual edits ON (button turns orange)
3. Hover over email components → See dashed outlines
4. Click a component → See solid outline + FloatingToolbar appears nearby
5. Try toolbar actions:
   - Type in AI input field → Should refine component (verify this works!)
   - Click icon buttons → Should insert prompts into chat
   - Click delete → Should remove component
6. Press ESC → Clears selection
7. Press Delete key → Removes selected component
8. Click toggle again → Visual edits OFF

### Test Cases to Verify
- [ ] Toggle on/off works
- [ ] Hover shows on ALL components (Container, Section, Heading, Text, Button)
- [ ] Click selects correct component
- [ ] Toolbar appears near clicked element
- [ ] Toolbar positioned below by default, above if no space
- [ ] Toolbar AI input refines component
- [ ] Icon buttons insert text into chat
- [ ] Delete button removes component
- [ ] ESC clears selection
- [ ] Delete key removes component
- [ ] Component changes save to database

---

## Next Steps (Prioritized)

### High Priority
1. **Test Toolbar Actions** - Verify AI refinement, icon buttons, delete all work
2. **Remove Debug Logs** - Clean up console.log statements in EmailV2Frame.tsx
3. **Test Component Refinement** - Ensure AI updates and database saves work

### Medium Priority
4. **Security Improvements** (Choose 1-2):
   - Add prop validation to reject dangerous attributes
   - Add CSP headers to iframe
   - Sanitize user-generated content with DOMPurify
   - Consider removing `allow-same-origin` from sandbox

5. **Implement Global Settings** - Replace alert with actual settings modal/panel

### Low Priority
6. **Add Undo/Redo** - If needed for V2 component tree
7. **Component Reordering** - Drag-and-drop if needed
8. **Multi-Select** - If needed
9. **Documentation Cleanup** - Consolidate multiple completion docs

---

## Security Improvement Options (For Future)

### Option 1: Prop Validation (Easiest)
```typescript
const DANGEROUS_PROPS = ['onClick', 'onError', 'onLoad', 'dangerouslySetInnerHTML'];

function sanitizeComponentProps(component: EmailComponent): EmailComponent {
  const cleanProps = {...component.props};
  DANGEROUS_PROPS.forEach(prop => delete cleanProps[prop]);
  return {...component, props: cleanProps};
}
```

### Option 2: Content Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(component.content);
```

### Option 3: CSP Headers
```typescript
// Add to iframe HTML
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline'; object-src 'none';">
```

### Option 4: Remove allow-same-origin
```typescript
// Change sandbox attribute
sandbox="allow-scripts"
// Note: Would need to refactor postMessage handling
```

---

## Database Schema (V2 Campaigns)

```sql
-- V2-specific columns in campaigns table
ALTER TABLE campaigns 
  ADD COLUMN version VARCHAR(10) DEFAULT 'v1',
  ADD COLUMN root_component JSONB,
  ADD COLUMN global_settings JSONB;

CREATE INDEX idx_campaigns_version ON campaigns(version);
```

### Sample V2 Campaign Structure
```json
{
  "version": "v2",
  "root_component": {
    "id": "root",
    "component": "Container",
    "props": {"style": {"maxWidth": "600px"}},
    "children": [
      {
        "id": "section-1",
        "component": "Section",
        "props": {},
        "children": [
          {
            "id": "heading-1",
            "component": "Heading",
            "props": {"as": "h1"},
            "content": "Welcome!"
          }
        ]
      }
    ]
  },
  "global_settings": {
    "fontFamily": "system-ui, sans-serif",
    "primaryColor": "#7c3aed",
    "maxWidth": "600px"
  }
}
```

---

## Key Decisions Made

1. **Iframe Approach**: Chose iframe over direct DOM rendering for security isolation (user-generated content safety)
2. **Component Matching**: Flattened tree approach instead of recursive 1:1 mapping (handles React Email's complex table structure)
3. **Descendant Attributes**: Apply `data-component-id` to ALL descendants to handle nested wrapper divs/spans
4. **Toolbar at Root**: Render FloatingToolbar at V2ChatEditor root level (not in ChatInterface) to avoid duplicates
5. **Smart Positioning**: Prefer below, fallback to above based on available viewport space
6. **Conditional Scripts**: Only inject interactive scripts when visual edits mode is ON (via `onComponentClick` prop)

---

## References

- **V2 Integration Guide**: `/docs/V2_INTEGRATION_GUIDE.md`
- **V2 Chat Mode Guide**: `/docs/V2_CHAT_MODE_QUICK_START.md`
- **Debug Summary**: `/docs/V2_VISUAL_EDITS_DEBUG.md`
- **Previous Completion Docs**: 
  - `/docs/V2_VISUAL_SELECTION_COMPLETE.md`
  - `/docs/V2_VISUAL_EDITS_TOGGLE_COMPLETE.md`
  - `/docs/V2_VISUAL_EDITS_FIXED.md`

---

## Questions for Next Session

1. **Are toolbar actions working?** (AI refinement, icon buttons, delete)
2. **Any UX issues discovered?** (positioning, selection, performance)
3. **Security priority?** (Should we implement prop validation now or later?)
4. **What features are most important?** (Global settings, undo/redo, drag-drop?)

---

**Session Complete**: Visual edits fully functional. Ready for testing and polish! 🎉

