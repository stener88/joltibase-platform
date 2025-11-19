# Visual Edits Delete - Quick Start Guide

## Quick Integration

If you're integrating the Visual Edits delete functionality into a page/component, here's what you need to know:

---

## 1. Import the Hook

```typescript
import { useVisualEditsState } from '@/hooks/use-visual-edits-state';
```

---

## 2. Initialize in Your Component

```typescript
const visualEditsState = useVisualEditsState(blocks);
```

---

## 3. Wire Up the Delete Handler

Pass the delete handler to your FloatingToolbar:

```typescript
<FloatingToolbar
  descriptor={selectedElement.descriptor}
  position={toolbarPosition}
  onAISubmit={handleAISubmit}
  onContentClick={() => setShowContentPanel(true)}
  onStylesClick={() => setShowStylesPanel(true)}
  onDeleteClick={() => {
    // Delete element
    const success = visualEditsState.deleteElement(
      visualEditsState.state.selectedElement?.descriptor
    );
    
    if (success) {
      // Clear selection so deleted element isn't selected
      visualEditsState.clearSelection();
    }
  }}
  onAddBlockClick={() => setShowBlockPalette(true)}
  isAILoading={isRefining}
/>
```

---

## 4. Handle Save/Discard

```typescript
// Save changes button
const handleSave = () => {
  const updatedBlocks = visualEditsState.applyChanges();
  // Update your campaign/email with new blocks
  await updateCampaign({ 
    id: campaignId, 
    blocks: updatedBlocks 
  });
};

// Discard changes button
const handleDiscard = () => {
  visualEditsState.discardChanges();
};
```

---

## That's It!

The delete functionality will automatically:
- ✅ Determine the correct delete behavior based on element type
- ✅ Show/hide the trash icon appropriately
- ✅ Display context-aware tooltips
- ✅ Track the delete as a pending change
- ✅ Show the SaveDiscardBar
- ✅ Apply or revert the delete when user clicks Save/Discard

---

## Delete Behaviors at a Glance

| Element Type | Behavior | What Happens |
|--------------|----------|--------------|
| Text, Button, Image, Logo, Spacer, Divider | **Delete Block** | Entire block removed |
| Title, Header, Paragraph, Subtitle, Badge (in layouts) | **Clear Content** | Content set to empty string |
| Button (in layout) | **Clear Content** | Button text cleared |
| Stat Items | **Remove Item** | Stat removed from array |
| Social Links | **Remove Item** | Link removed from array |
| Required Footer Fields | **Not Deletable** | Trash icon hidden |
| Optional Footer Fields | **Clear Content** | Content set to empty string |

---

## Example: Full Integration

```typescript
'use client';

import { useState } from 'react';
import { useVisualEditsState } from '@/hooks/use-visual-edits-state';
import { FloatingToolbar } from '@/components/campaigns/visual-edits/FloatingToolbar';
import { SaveDiscardBar } from '@/components/campaigns/visual-edits/SaveDiscardBar';

export function MyEditor({ initialBlocks, onSave }) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const visualEdits = useVisualEditsState(blocks);

  const handleSaveChanges = async () => {
    const updatedBlocks = visualEdits.applyChanges();
    setBlocks(updatedBlocks);
    await onSave(updatedBlocks);
  };

  return (
    <div>
      {/* Email Preview */}
      <EmailFrame blocks={blocks} />
      
      {/* Floating Toolbar (shown when element selected) */}
      {visualEdits.state.selectedElement && (
        <FloatingToolbar
          descriptor={visualEdits.state.selectedElement.descriptor}
          position={{ x: 100, y: 200 }}
          onAISubmit={(prompt) => console.log('AI:', prompt)}
          onContentClick={() => console.log('Edit content')}
          onStylesClick={() => console.log('Edit styles')}
          onDeleteClick={() => {
            visualEdits.deleteElement(
              visualEdits.state.selectedElement.descriptor
            );
            visualEdits.clearSelection();
          }}
          onAddBlockClick={() => console.log('Add block')}
        />
      )}
      
      {/* Save/Discard Bar (shown when changes pending) */}
      {visualEdits.state.isDirty && (
        <SaveDiscardBar
          onSave={handleSaveChanges}
          onDiscard={visualEdits.discardChanges}
          changeCount={visualEdits.state.pendingChanges.size}
        />
      )}
    </div>
  );
}
```

---

## Troubleshooting

### Trash icon not showing for any elements
**Issue:** Import statement missing or descriptor not passed correctly.

**Fix:** Ensure FloatingToolbar receives the descriptor prop.

---

### Delete not working
**Issue:** `deleteElement` not called or descriptor is undefined.

**Fix:** Check that `visualEdits.state.selectedElement?.descriptor` is defined.

---

### Deletes not being saved
**Issue:** Not calling `applyChanges()` when save button clicked.

**Fix:** Wire up save button to call `visualEdits.applyChanges()`.

---

### Layout breaks after deleting stat
**Issue:** Renderer may not handle empty arrays.

**Fix:** Ensure your stat renderer checks for empty array and renders nothing gracefully.

---

## Need More Info?

See full documentation: `VISUAL_EDITS_DELETE_IMPLEMENTATION.md`

