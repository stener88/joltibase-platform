# Visual Email Editor - Architecture & Challenges

## Overview

The visual email editor allows users to make real-time edits to React Email components through:
1. **AI-powered chat prompts** - Natural language instructions for content/style changes
2. **Property Inspector** - Direct manipulation of CSS properties via UI controls
3. **Visual selection** - Click-to-select interface elements in iframe preview

## System Architecture

### Core Components

#### 1. Frontend (`V2ChatEditor.tsx`)
- Main orchestrator component
- Manages visual edit mode state
- Handles iframe communication via postMessage
- Coordinates between chat interface, property inspector, and preview
- Uses React Query (`useCampaign` hook) for data fetching and caching
- Local state management:
  - `visualModeHtml` - Transient HTML edits before save
  - `visualEditMode` - Boolean for edit mode state
  - `v2SelectedContext` - Currently selected element metadata
  - `renderKey` - Forces iframe reload on changes

#### 2. Backend API Endpoints

**`/api/v2/campaigns/[id]/visual-edit`**
- Handles AI-powered edits
- Calls `handleVisualEdit()` from `emails/lib/visual-editor.ts`
- Saves updated TSX to filesystem
- Re-renders to HTML
- Updates database (`campaigns_v2` table)

**`/api/v2/campaigns/[id]/property-edit`**
- Handles direct property changes from PropertyInspector
- Uses string replacement/regex to update TSX code
- Debounced immediate saving (500ms)
- Multiple fallback strategies for finding elements

**`/api/v2/campaigns/[id]/prepare-visual-mode`**
- Called when entering visual mode
- Injects `data-edit-id` attributes into TSX AST
- Ensures IDs persist in source code
- Saves TSX with IDs to filesystem and database

**`/api/v2/campaigns/[id]/update-html`**
- Simple endpoint for updating HTML content
- Used for save/discard operations

**`/api/v2/campaigns/[id]/batch-save`**
- Complex AST-based batch update endpoint
- Applies multiple property changes at once
- Currently deprecated in favor of immediate saves

#### 3. Visual Editing Logic (`emails/lib/visual-editor.ts`)

**Intent Detection:**
- Analyzes user prompts to determine edit type (text, style, structure)
- Confidence scoring (0-1)
- Complexity assessment (SIMPLE vs COMPLEX)

**Execution Paths:**
- **Simple Path**: Direct string replacement (fast, ~10-50ms)
  - Text changes
  - Simple color/style updates
- **AI Path**: Full regeneration with Gemini (slow, ~5-15s)
  - Structural changes
  - Complex multi-property updates
  - Deletions

**Key Functions:**
- `handleVisualEdit()` - Main entry point
- `applySimpleEdit()` - String replacement for simple changes
- `applyAIEdit()` - AI-powered regeneration
- `applyColorChange()` - Direct color updates in TSX code

#### 4. Rendering (`emails/lib/renderer.ts`)

**Process:**
1. Transpile TSX to JavaScript using esbuild
2. Execute in isolated VM context
3. Render React component to HTML string
4. Inject `data-edit-id` attributes into rendered HTML
5. Inject visual editor JavaScript handlers

**`injectEditIds()` Function:**
- Adds `data-edit-id` attributes to editable elements in HTML
- **CRITICAL**: Should preserve existing IDs from TSX, only add missing ones
- Counter-based ID generation (`heading-0`, `text-1`, `button-2`, etc.)

#### 5. AST Manipulation (`lib/email-v2/ast-editor.ts`)

**Purpose:**
- Parse TSX code into Abstract Syntax Tree
- Safely modify React components
- Validate generated code

**Key Functions:**
- `parseTSX()` - Parse TSX string to Babel AST
- `findElementByEditId()` - Locate JSX element by data-edit-id
- `updateStyleProperty()` - Modify inline styles or style objects
- `updateTextContent()` - Change element text
- `injectEditIdsIntoAST()` - Add data-edit-id to JSX elements
- `applyAllChanges()` - Batch update multiple elements

#### 6. Client-Side Handlers (`lib/utils/inject-visual-handlers.ts`)

**Injected into iframe:**
- Element selection via click
- Hover effects
- postMessage communication to parent
- `injectEditIdsIfMissing()` - Client-side ID injection fallback

### Data Flow

#### Entering Visual Mode
```
1. User clicks "Visual Edit" button
2. V2ChatEditor calls /prepare-visual-mode API
3. API injects data-edit-id into TSX AST
4. Saves TSX with IDs to filesystem + database
5. Renders to HTML with IDs
6. Returns HTML to frontend
7. Frontend sets visualModeHtml and displays in iframe
```

#### Making a Property Change (via PropertyInspector)
```
1. User adjusts color picker/slider
2. Debounced onChange fires (500ms delay)
3. Calls /property-edit API with editId and changes
4. API finds element in TSX by data-edit-id
5. Updates TSX code (inline style override if shared object)
6. Saves TSX to filesystem
7. Re-renders to HTML
8. Updates database
9. Returns HTML to frontend
10. Frontend updates visualModeHtml
11. Iframe reloads with renderKey increment
```

#### Making an AI Edit (via Chat Prompt)
```
1. User types prompt + clicks send
2. Calls /visual-edit API with selected element context
3. API analyzes intent and complexity
4. SIMPLE path: String replacement in TSX
   OR
   COMPLEX path: AI regenerates entire component
5. Validates generated code
6. Saves TSX to filesystem
7. Re-renders to HTML  
8. Updates database
9. Returns HTML to frontend
10. Frontend updates visualModeHtml
11. Iframe reloads
```

#### Exiting Visual Mode (Save)
```
1. User clicks "Save & Exit"
2. Clears visualModeHtml local state
3. Invalidates React Query cache
4. Cache refetches from database
5. Component re-renders with fresh data
```

## Critical Challenges

### Challenge 1: State Management - Multiple Sources of Truth

**Problem:**
- Parent page: `useState` + manual `fetch()`
- V2ChatEditor: Received `v2Html` prop
- React Query cache: Background data fetching
- `visualModeHtml`: Local transient edits
- Database: Persistent storage

**Competing Updates:**
- `useEffect` constantly overwrites local edits when prop changes
- `queryClient.invalidateQueries()` after edits causes stale data to overwrite fresh edits
- Prop drilling creates lag and stale closures

**Solution Attempted:**
- Migrated to React Query (`useCampaign` hook)
- Removed prop drilling of `v2Html`
- Single cache as source of truth
- Local `visualModeHtml` only for transient visual edits
- Remove invalidation during editing, only on exit

**Current Status:** Partially implemented

### Challenge 2: data-edit-id Misalignment

**Problem:**
The fundamental architecture has a critical flaw:

**TSX Source (Static):**
```tsx
<Section style={section} data-edit-id="table-1">...</Section>
<Section style={section} data-edit-id="table-2">...</Section>
{items.map((item, i) => (
  <Section key={i} style={section} data-edit-id="table-3">
    ...
  </Section>
))}
```

**Rendered HTML (Dynamic):**
- If `items.length = 5`, this creates `table-3`, `table-4`, `table-5`, `table-6`, `table-7`
- But TSX only has `table-3`!
- When user clicks `table-6`, property-edit API can't find it in TSX

**Additional Complications:**
- `injectEditIds()` in renderer was **overwriting** TSX IDs with sequential HTML IDs
- AI regeneration creates fresh TSX **without** `data-edit-id` attributes
- `prepare-visual-mode` injects IDs when entering visual mode, but they're lost after AI edits

**Attempted Solutions:**
1. Re-inject IDs after AI edits → Created `injectEditIdsIntoAST()` function
2. Preserve existing IDs during HTML rendering → Added negative lookahead to regex
3. Multiple fallback strategies in property-edit → Text-based, tag counting

**Current Status:** Partially working, but fragile

### Challenge 3: Shared Style Objects

**Problem:**
```tsx
const section = { padding: '20px', borderTop: '1px solid #cccccc' };

<Section style={section} data-edit-id="table-1">...</Section>
<Section style={section} data-edit-id="table-2">...</Section>
<Section style={section} data-edit-id="table-3">...</Section>
```

When updating `table-3`'s backgroundColor:
- Original approach: Modified `const section = {...}` 
- Result: ALL sections changed (table-1, table-2, table-3)

**Solution:**
Convert to inline style override:
```tsx
// Before
<Section style={section} data-edit-id="table-3">

// After
<Section style={{...section, backgroundColor: '#fdafaf'}} data-edit-id="table-3">
```

**Current Status:** Implemented, but may cause syntax errors with quote escaping

### Challenge 4: AI Token Limits

**Problem:**
- Gemini `MAX_TOKENS` error when generating large components
- Initial limit: 2000 tokens
- Large emails exceed this

**Solution:**
- Increased `maxTokens` from 2000 to 8000
- Enhanced retry logic with better error messages

**Current Status:** Fixed

### Challenge 5: Save/Exit "Flash" Behavior

**Problem:**
When clicking "Save & Exit", user sees brief flash of old content before new content appears.

**Cause:**
1. Clear `visualModeHtml` (reverts to cache)
2. Invalidate React Query cache
3. Cache refetches from database
4. Brief moment where cache is stale

**Solution:**
```tsx
await queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
await queryClient.refetchQueries({ queryKey: ['campaign', campaignId] });
setVisualModeHtml(null); // Clear after cache is fresh
```

**Current Status:** Implemented

### Challenge 6: Duplicate Declarations from AI

**Problem:**
AI sometimes generates:
```tsx
const h1 = {...};
const h1 = {...}; // Duplicate!
```

**Solution:**
Enhanced validator to detect:
- Duplicate const declarations
- Multiple variable declarations in one statement
- Type annotations
- Destructuring patterns

**Current Status:** Fixed

### Challenge 7: Property Changes Not Persisting

**Problem:**
- PropertyInspector changes saved to `pendingChangesRef`
- Batch-save called on exit
- AST couldn't find elements with dynamic IDs
- Changes lost

**Solution (Architecture Shift):**
Moved from **"batch save on exit"** to **"immediate debounced save"**:
- Property changes → debounced 500ms → `/property-edit` API
- AI edits → immediate → `/visual-edit` API
- No batching, each edit saves individually

**Current Status:** Implemented

### Challenge 8: V1 vs V2 Campaign Compatibility

**Problem:**
- "Create Manually" button created V1 campaigns (in `campaigns` table)
- V2 editor expected `campaigns_v2` table
- Mixed campaign types caused confusion

**Solution:**
- Updated all APIs to check BOTH `campaigns` and `campaigns_v2` tables
- Maintain backward compatibility
- Keep "Create Manually" enabled (user requirement)

**Current Status:** Fixed

### Challenge 9: Module Caching (Next.js/Turbopack)

**Problem:**
```
TypeError: injectEditIdsIntoAST is not a function
```

**Cause:**
Next.js dev server cached old module versions after file changes.

**Solution:**
Restart dev server (no code fix possible)

**Current Status:** Known workaround

### Challenge 10: Iframe Reloading Issues

**Problem:**
- Visual edits made, but iframe doesn't update
- Stale HTML displayed

**Solution:**
- Added `renderKey` state
- Increment on every edit
- Forces iframe to remount: `key={renderKey}`

**Current Status:** Fixed

### Challenge 11: Chat Layout Issues

**Problem:**
- Chat history visible when PropertyInspector open
- Chat input too high (not at bottom)
- White space between elements

**Solution:**
- Added `hideChatHistory` prop to `ChatInterface`
- Conditional rendering of chat messages
- CSS adjustments: `flex flex-col h-full`, proper padding
- Background color matching

**Current Status:** Fixed

### Challenge 12: PropertyInspector Styling

**Problem:**
Didn't match platform design system colors.

**Solution:**
Updated to platform colors:
- Background: `#faf9f5`
- Border: `#e8e7e5`
- Text: `#3d3d3a`
- Focus ring: `#e9a589`

**Current Status:** Fixed

## Known Issues & Limitations

### 1. Dynamic Content in Loops
**Issue:** 
```tsx
{items.map((item, i) => <Section data-edit-id="table-3">...)}
```
Creates multiple HTML elements (`table-3`, `table-4`, `table-5`) from ONE TSX element.

**Impact:** 
- Property edits fail for dynamically generated elements
- `table-6` exists in HTML but not in TSX

**Potential Solutions:**
- Generate unique IDs per loop iteration: `data-edit-id={`table-${baseId}-${i}`}`
- Store edit mappings in database
- Restrict editing to static elements only

### 2. Shared Style Object Side Effects
**Issue:**
```tsx
const section = { padding: '20px' };
<Section style={section} data-edit-id="table-1">
<Section style={section} data-edit-id="table-2">
```

**Impact:**
Editing one element affects all elements using the same style object.

**Current Fix:**
Convert to inline override: `style={{...section, backgroundColor: '#ff0000'}}`

**Limitation:**
- Increases code size
- May have quote escaping issues
- Not ideal for maintaining consistent design

### 3. AI Regeneration Loses IDs
**Issue:**
AI generates fresh TSX without `data-edit-id` attributes.

**Impact:**
After AI edit, subsequent property edits fail.

**Attempted Fix:**
Re-inject IDs after AI edits in `/visual-edit` route.

**Status:**
Inconsistent - sometimes works, sometimes doesn't.

### 4. Text Editing Reversion
**Issue:**
Text edits made via property inspector or AI revert to old values.

**Possible Causes:**
- React Query cache not invalidating properly
- `visualModeHtml` state being overwritten
- Multiple re-renders causing state conflicts
- Negative lookahead regex preventing ID injection

**Status:**
ACTIVE BUG - needs investigation

### 5. ID Injection Race Conditions
**Issue:**
Three places inject IDs with different timing:
1. `renderer.ts` - During HTML render
2. `inject-visual-handlers.ts` - Client-side in iframe
3. `ast-editor.ts` - When entering visual mode

**Impact:**
- ID mismatches between TSX and HTML
- Counters get out of sync
- Some elements get IDs, others don't

**Status:**
FRAGILE - needs architectural rethink

## Technical Debt

### 1. Regex-Based Code Manipulation
**Current:** String replacement with regex patterns
**Risk:** Fragile, breaks on edge cases, doesn't understand syntax
**Better Approach:** Full AST-based editing (already partially implemented)

### 2. Multiple Edit ID Injection Points
**Current:** Three different places inject IDs
**Risk:** Inconsistent, hard to debug, race conditions
**Better Approach:** Single source of truth, inject once when component created

### 3. Mixed Data Sources
**Current:** React Query cache + local state + database
**Risk:** State synchronization issues, stale data
**Better Approach:** Single cache-based architecture with optimistic updates

### 4. Batch Save Complexity
**Current:** Complex AST batching logic (mostly removed)
**Previous Risk:** Over-engineered, hard to maintain
**Current:** Immediate debounced saves (simpler)

### 5. Error Recovery
**Current:** Multiple try/catch blocks, console.log debugging
**Risk:** Errors silently swallowed, hard to diagnose
**Better Approach:** Structured error handling, error boundary components, telemetry

## Architectural Recommendations

### Short-term Fixes
1. **Remove negative lookahead from ID injection** - Causing text edits to fail
2. **Consistent ID generation** - Use same counters across TSX/HTML
3. **Debug logging** - Add comprehensive logging to trace data flow
4. **Fix quote escaping** - Ensure values are properly escaped in inline styles

### Medium-term Improvements
1. **Full AST-based editing** - Eliminate regex string replacement
2. **Unique IDs for dynamic content** - Handle `.map()` loops properly
3. **Optimistic UI updates** - Show changes instantly, sync in background
4. **Better error messages** - User-friendly error explanations

### Long-term Vision
1. **Event Sourcing** - Store all edits as events, replay for undo/redo
2. **Collaborative Editing** - Real-time multi-user support
3. **Visual Diff** - Show changes before save
4. **Component Library** - Pre-built blocks with guaranteed edit compatibility

## Key Files Reference

### Frontend
- `/components/email-editor/V2ChatEditor.tsx` - Main editor orchestrator
- `/components/email-editor/PropertyInspector.tsx` - Style editing UI
- `/components/campaigns/ChatInterface.tsx` - AI prompt interface
- `/lib/hooks/useCampaign.ts` - React Query hooks

### Backend
- `/app/api/v2/campaigns/[id]/visual-edit/route.ts` - AI edits
- `/app/api/v2/campaigns/[id]/property-edit/route.ts` - Property edits
- `/app/api/v2/campaigns/[id]/prepare-visual-mode/route.ts` - ID injection
- `/app/api/v2/campaigns/[id]/batch-save/route.ts` - Batch updates (deprecated)
- `/app/api/v2/campaigns/[id]/update-html/route.ts` - Simple HTML update

### Core Logic
- `/emails/lib/visual-editor.ts` - Intent detection, AI integration
- `/emails/lib/renderer.ts` - TSX→HTML rendering, ID injection
- `/lib/email-v2/ast-editor.ts` - AST parsing, manipulation
- `/lib/utils/inject-visual-handlers.ts` - Client-side editing handlers

### Database Schema
**`campaigns_v2` table:**
- `id` - UUID primary key
- `user_id` - FK to users
- `html_content` - Rendered HTML with inline styles
- `component_code` - TSX source code
- `component_filename` - e.g., `Email_1764079651390_2wlnu3.tsx`
- `created_at`, `updated_at` - Timestamps

**`campaigns` table (legacy):**
- Similar structure but uses `tsx_code` instead of `component_code`

## Performance Metrics

### Simple Edits (String Replacement)
- Latency: 10-50ms
- Success Rate: ~70%
- Failures: Element not found, ambiguous text

### AI Edits (Full Regeneration)
- Latency: 5-15 seconds
- Success Rate: ~90%
- Failures: Token limits, invalid TSX, validation errors

### Property Edits (Debounced)
- Debounce: 500ms
- Total latency: 500-800ms
- Success Rate: ~60% (due to ID mismatch issues)

## Debugging Tips

### Enable Extensive Logging
Look for console logs with prefixes:
- `[V2ChatEditor]` - Frontend state changes
- `[VISUAL-EDIT]` - Intent detection, execution path
- `[AI]` - AI generation attempts
- `[RENDERER]` - TSX compilation, HTML rendering
- `[PROPERTY-EDIT]` - Property update attempts
- `[AST]` - AST manipulation, validation
- `[BATCH-SAVE]` - Batch update processing
- `[IFRAME]` - Client-side selection, events

### Common Issues

**"Element not found" errors:**
- Check if `data-edit-id` exists in TSX file
- Verify ID counters match between TSX and HTML
- Look for dynamic content (`.map()` loops)

**"Syntax error" in generated code:**
- Check for double quotes: `color: ''#ff0000''`
- Verify `formatStyleValue()` logic
- Inspect generated TSX before rendering

**Changes not persisting:**
- Check React Query cache invalidation
- Verify database updates
- Look for competing state updates (`useEffect` overwriting)

**Iframe not updating:**
- Verify `renderKey` is incrementing
- Check `visualModeHtml` state
- Ensure postMessage handlers are active

## Testing Strategy

### Manual Testing Checklist
1. ✅ Enter visual mode - preview loads
2. ✅ Select element - shows in PropertyInspector
3. ✅ Change color via picker - updates immediately
4. ✅ Change font size - updates immediately  
5. ⚠️ Make AI edit - updates, but loses IDs
6. ⚠️ Change property after AI edit - may fail
7. ⚠️ Edit dynamically generated element - fails
8. ✅ Save & exit - persists to database
9. ✅ Discard & exit - reverts to original
10. ✅ Re-enter visual mode - shows saved changes

### Edge Cases to Test
- [ ] Editing elements inside `.map()` loops
- [ ] Editing elements with shared style objects
- [ ] Multiple rapid property changes (debounce)
- [ ] AI edit followed immediately by property edit
- [ ] Very large components (>500 lines TSX)
- [ ] Components with complex nested structure
- [ ] Elements with both `style={obj}` and inline `style={{}}`

## Conclusion

The visual editor is a complex system with multiple moving parts. The core challenges revolve around:

1. **State synchronization** - Multiple sources of truth competing
2. **ID persistence** - Dynamic HTML vs static TSX mismatch
3. **Code manipulation** - Regex vs AST tradeoffs
4. **Shared state mutations** - Style objects affecting multiple elements

The current implementation works for **simple, static components** but struggles with **dynamic content and complex state management**.

### Immediate Next Steps
1. Fix text editing reversion bug
2. Resolve ID injection race conditions
3. Handle dynamic content in loops properly
4. Comprehensive end-to-end testing

### Long-term Recommendations
1. Consider restricting visual editing to **static content only**
2. Or implement **ID mapping system** for dynamic content
3. Full migration to **AST-based editing** (eliminate regex)
4. Add **undo/redo** with event sourcing
5. Implement **visual diff preview** before save

