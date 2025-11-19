# V2 Chat Mode Integration - Quick Start

## Overview

Simple integration to add React Email V2 support to your existing chat-based campaign editor. This focuses **only on Chat Mode** with visual edits - the most powerful and intuitive editing experience.

---

## What You Get

### ✨ Chat Mode Features

1. **AI Email Generation**
   - Natural language prompts
   - Full email creation
   - Multiple variations

2. **Click-to-Select Visual Edits**
   - Click any component in preview
   - AI refines selected component
   - Quick action suggestions

3. **Component Inspector**
   - Shows selected component details
   - Quick edit suggestions
   - Content preview

4. **Same UX as V1**
   - Split-screen layout (chat left, preview right)
   - Same chat interface
   - Same toolbar and controls

---

## Integration (3 Steps)

### Step 1: Add Imports

Add to `/app/dashboard/campaigns/[id]/edit/page.tsx`:

```typescript
// Add after line 16 (after existing imports)
import { V2ChatEditor } from '@/components/email-editor/V2ChatEditor';
import { EmailV2Frame } from '@/components/email-editor/EmailV2Frame';
import type { EmailComponent, GlobalEmailSettings as V2GlobalSettings } from '@/lib/email-v2/types';
```

### Step 2: Add Version Detection

Add after line 70 (after `useCampaignQuery`):

```typescript
// Detect V2 campaign
const isV2Campaign = campaign?.version === 'v2' && campaign?.root_component;
```

### Step 3: Update Chat Mode Rendering

Find the chat mode rendering (around line 754), and update it:

```typescript
leftPanel={
  editorMode === 'chat' ? (
    // Check if V2 campaign
    isV2Campaign ? (
      <V2ChatEditor
        initialRootComponent={campaign.root_component as EmailComponent}
        initialGlobalSettings={
          campaign.global_settings || {
            fontFamily: 'system-ui, sans-serif',
            primaryColor: '#7c3aed',
            maxWidth: '600px',
          }
        }
        campaignId={campaignId}
        deviceMode={deviceMode}
      />
    ) : (
      // Existing V1 ChatInterface
      <ChatInterface
        ref={chatInterfaceRef}
        campaignId={campaignId}
        onRefine={handleRefine}
        isRefining={refineMutation.isPending}
        chatHistory={chatHistory}
        // ... rest of V1 props
      />
    )
  ) : (
    // Edit mode stays the same
    <DirectEditor ... />
  )
}
rightPanel={
  // Check if V2 campaign for preview
  isV2Campaign ? (
    <EmailV2Frame
      rootComponent={campaign.root_component as EmailComponent}
      globalSettings={
        campaign.global_settings || {
          fontFamily: 'system-ui, sans-serif',
          primaryColor: '#7c3aed',
          maxWidth: '600px',
        }
      }
      deviceMode={deviceMode}
    />
  ) : (
    // Existing V1 EmailPreview
    <EmailPreview
      blocks={workingBlocks}
      designConfig={editorHistory.state.globalSettings}
      // ... rest of V1 props
    />
  )
}
```

---

## That's It! 🎉

Now V2 campaigns will automatically use the new chat editor when you visit:
```
http://localhost:3000/dashboard/campaigns/[v2-campaign-id]/edit
```

---

## How It Works

### User Flow

1. **Chat Interface (Left)**
   - Type natural language prompts
   - "Create a welcome email for a SaaS product"
   - AI generates complete email

2. **Live Preview (Right)**
   - See email render in real-time
   - Click any component to select it
   - Selection shows in chat with context

3. **Component Editing**
   - Selected component shows overlay with quick actions
   - Type refinement prompts:
     - "Make the text larger"
     - "Change color to blue"
     - "Add more padding"
   - AI updates just that component

4. **Auto-Save**
   - All changes save automatically
   - Version history maintained
   - Undo/redo available

### Example Conversation

```
You: Create a welcome email for our app

AI: ✓ Generated new email successfully
[Shows email with header, features, CTA]

You: [Clicks headline in preview]
You: Make this text larger and bold

AI: ✓ Updated heading successfully
[Headline is now larger and bold]

You: [Clicks button]
You: Change button color to green

AI: ✓ Updated button successfully
[Button is now green]
```

---

## Creating a V2 Campaign

### Option 1: Via Chat (Easiest)

Just start chatting! The first message will create a V2 campaign:

```
You: Create a welcome email for my SaaS product with a 
     purple header, feature list, and green CTA button
```

### Option 2: Via API

```bash
curl -X POST http://localhost:3000/api/ai/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "your-campaign-id",
    "prompt": "Create a welcome email"
  }'
```

This sets `version = 'v2'` and creates `root_component`.

---

## Features

### ✅ What Works

- Full email generation from prompts
- Component-level refinement
- Click-to-select in preview
- Visual selection highlights
- Quick action suggestions
- Auto-save
- Desktop/mobile preview modes
- Chat history

### 🚧 Not Included (Use Visual Mode for These)

- Component tree navigation
- Drag and drop
- Manual component editing
- Style inspector
- Component duplication

---

## Visual Edits Mode

When you click a component in the preview:

### Overlay Shows:
- **Component type** (Heading, Text, Button, etc.)
- **Current content** preview
- **Quick actions**:
  - "Make the text larger"
  - "Change color to blue"
  - "Add more padding"
  - "Make it bold"
  - "Center align this"

### Chat Context:
- Chat knows which component is selected
- Your prompt applies to that component only
- Clear button to deselect and return to full email editing

---

## Testing

### 1. Create Test V2 Campaign

```sql
-- In Supabase SQL editor
UPDATE campaigns 
SET 
  version = 'v2',
  root_component = '{
    "id": "root",
    "component": "Container",
    "props": {"style": {"maxWidth": "600px"}},
    "children": [
      {
        "id": "section-1",
        "component": "Section",
        "props": {"style": {"padding": "40px", "backgroundColor": "#7c3aed"}},
        "children": [
          {
            "id": "heading-1",
            "component": "Heading",
            "props": {"as": "h1", "style": {"color": "#ffffff", "fontSize": "32px"}},
            "content": "Welcome!"
          }
        ]
      }
    ]
  }'::jsonb
WHERE id = 'your-campaign-id';
```

### 2. Open in Editor

```
http://localhost:3000/dashboard/campaigns/your-campaign-id/edit
```

### 3. Test Features

✅ **Generation**: Type "Create a product launch email"
✅ **Component Select**: Click the heading in preview
✅ **Refinement**: Type "Make this heading larger and purple"
✅ **Quick Actions**: Click a suggestion button
✅ **Deselect**: Click "Clear Selection" or ESC key

---

## Backwards Compatibility

✅ **V1 campaigns work exactly as before**
- No changes to V1 functionality
- Same chat interface for V1
- Same preview for V1
- Zero breaking changes

✅ **Automatic detection**
- System checks `campaign.version`
- V2 → Uses V2ChatEditor
- V1 → Uses existing ChatInterface

---

## Troubleshooting

### Issue: "Component not found"
**Solution**: Refresh the page after AI generation

### Issue: Click not selecting component
**Solution**: Check that `root_component` has proper `id` fields on all components

### Issue: AI refinement not working
**Solution**: Verify `GEMINI_API_KEY` is set in `.env.local`

### Issue: Changes not saving
**Solution**: Check `/api/campaigns/[id]/v2` endpoint is working

---

## File Checklist

After integration, you should have modified:

- ✅ `/app/dashboard/campaigns/[id]/edit/page.tsx` (3 changes)
  - Added imports
  - Added version detection
  - Updated chat rendering

New files created:
- ✅ `/components/email-editor/V2ChatEditor.tsx`
- ✅ `/components/email-editor/EmailV2Frame.tsx`

That's all! Only **1 file modified**, **2 files created**.

---

## Next Steps

1. Apply the 3 changes above
2. Create or convert a campaign to V2
3. Open in editor and test chat mode
4. Enjoy AI-powered visual editing! 🚀

---

**Time to integrate**: ~5 minutes
**Lines of code changed**: ~30 lines
**Breaking changes**: Zero
**Backwards compatible**: ✅ Yes

