# Refinement API Usage Plan

## Current Architecture

**All campaigns are V2** - Using semantic blocks + EmailComponent tree

### Active Editor
- **Route:** `/dashboard/campaigns/[id]/edit`
- **Component:** `V2ChatEditor`
- **Data:** Semantic blocks + EmailComponent tree (root_component)
- **Version:** `v2` (stored in database)

### Legacy Code Removed ✅
- `/app/campaigns/[id]/page.tsx` - Old V1 editor (deleted)
- `/app/api/ai/refine-element/route.ts` - V1 element refinement API (deleted)
- `/components/campaigns/DirectEditor.tsx` - V1 direct editor component (deleted)

## API Mapping

### `/api/ai/refine-component` ✅
**Purpose:** Refine individual V2 EmailComponents
**Used by:** FloatingToolbar onAISubmit (visual edits toolbar)
**Status:** ✅ Implemented and working
**Location:** `components/email-editor/V2ChatEditor.tsx` → `handleToolbarAISubmit` → `handleComponentRefinement`

### `/api/ai/refine-campaign` ✅
**Purpose:** Refine entire V2 campaigns (semantic blocks)
**Used by:** ChatInterface PromptInput (main chat input)
**Status:** ✅ Implemented and working
**Location:** `components/email-editor/V2ChatEditor.tsx` → `handleChatSubmit` → `/api/ai/refine-campaign`
**Features:**
- Refines semantic blocks using AI
- Converts to EmailComponent tree
- Saves to database (semantic_blocks, global_settings, html_content)
- Returns rootComponent for V2 editor

### `/api/ai/refine-element` ❌
**Purpose:** Refine individual elements within V1 blocks
**Used by:** N/A (V1 not used)
**Status:** ❌ Removed - V1 no longer used

## Summary

| Location | Input Type | API | Status |
|----------|------------|-----|--------|
| V2ChatEditor ChatInterface PromptInput | Chat input | refine-campaign | ✅ Working |
| V2ChatEditor FloatingToolbar | Toolbar input | refine-component | ✅ Working |

## Completed ✅

1. ✅ Updated `/api/ai/refine-campaign` to work with V2 semantic blocks
   - Converts semantic blocks to EmailComponent tree
   - Saves to database (semantic_blocks, global_settings, html_content)
   - Returns rootComponent for V2 editor
2. ✅ Removed legacy V1 editor (`/app/campaigns/[id]/page.tsx`)
3. ✅ Removed refine-element API (`/app/api/ai/refine-element/route.ts`)
4. ✅ Updated V2ChatEditor to use `/api/ai/refine-campaign` for refinement
   - Falls back to `/api/ai/generate-email` if no existing blocks found
   - Uses rootComponent from API response
   - Invalidates query cache after refinement
