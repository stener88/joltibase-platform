# Unified Visual Editor Integration Guide

## Summary

The unified visual editor has been implemented with the following components:

### ✅ Completed Components

1. **DOM Scanner** (`emails/lib/dom-scanner.ts`)
   - Scans entire email DOM
   - Identifies all editable components
   - Assigns unique IDs
   - Progress tracking

2. **Update Queue** (`lib/editor/update-queue.ts`)
   - Batches updates from all three edit methods
   - 500ms debounce auto-save
   - Status tracking

3. **ContentEditable Handler** (`lib/editor/contenteditable.ts`)
   - Direct text editing in preview
   - Auto-save on blur/Enter

4. **Property Inspector** (`components/email-editor/PropertyInspector.tsx`)
   - Context-aware property controls
   - Instant preview updates

5. **Scanning Progress Modal** (`components/email-editor/ScanningProgress.tsx`)
   - Shows progress during DOM scan

6. **Save Status Indicator** (`components/email-editor/SaveStatusIndicator.tsx`)
   - Shows save status (Saved, Saving, Unsaved)

7. **Exit Confirmation Modal** (`components/email-editor/ExitConfirmationModal.tsx`)
   - Confirms exit with unsaved changes

8. **Batch Update API** (`app/api/editor/batch-update/route.ts`)
   - Processes batched updates

## Integration Steps Remaining

### 1. Update `handleVisualEditsToggle` in V2ChatEditor.tsx

Replace the v2 campaign section with DOM scanning:

```typescript
if (isV2Campaign) {
  if (visualEditMode) {
    // Exit logic - check for unsaved changes
    if (updateQueueRef.current?.hasUnsavedChanges()) {
      setShowExitConfirmation(true);
    } else {
      setVisualEditMode(false);
      setSelectedEditableComponent(null);
    }
  } else {
    // Enter visual mode - start DOM scanning
    setIsScanning(true);
    setScanProgress({ current: 0, total: 0, percent: 0 });
    
    // Wait for iframe to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) {
      throw new Error('Iframe not ready');
    }
    
    // Scan DOM
    const components = await scanEntireDOM(iframe.contentDocument, (progress) => {
      setScanProgress(progress);
    });
    
    // Make interactive
    makeElementsInteractive(components, (component) => {
      setSelectedEditableComponent(component);
      // Calculate bounds
      const rect = component.element.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      setV2SelectedElementBounds(new DOMRect(
        rect.left + iframeRect.left,
        rect.top + iframeRect.top,
        rect.width,
        rect.height
      ));
    });
    
    setEditableComponents(components);
    setVisualEditMode(true);
    setIsScanning(false);
  }
}
```

### 2. Add PropertyInspector to Chat Panel

Modify the `chatPanel` in V2ChatEditor.tsx:

```typescript
const chatPanel = (
  <div className="flex flex-col h-full">
    {/* Property Inspector - shows when in visual mode and element selected */}
    {isV2Campaign && visualEditMode && selectedEditableComponent && (
      <PropertyInspector
        selectedComponent={selectedEditableComponent}
        onPropertyChange={(elementId, property, value) => {
          // Update preview instantly
          const iframe = iframeRef.current;
          const element = iframe?.contentDocument?.querySelector(`[data-editor-id="${elementId}"]`);
          if (element) {
            (element as HTMLElement).style[property as any] = value.toString();
          }
          
          // Queue update
          updateQueueRef.current?.queueUpdate({
            type: 'property',
            elementId,
            data: { property, value },
          });
        }}
        onAIEdit={async (message) => {
          // Handle AI edit via existing API
          const response = await fetch(`/api/v2/campaigns/${campaignId}/refine`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message,
              componentContext: {
                type: selectedEditableComponent.type,
                text: selectedEditableComponent.text,
              },
            }),
          });
          
          const result = await response.json();
          if (result.success && result.html) {
            setCurrentHtmlContent(result.html);
            setRenderKey(prev => prev + 1);
            
            // Queue AI update
            updateQueueRef.current?.queueUpdate({
              type: 'ai',
              elementId: selectedEditableComponent.id,
              data: { message, result },
            });
          }
        }}
        onClose={() => setSelectedEditableComponent(null)}
      />
    )}
    
    {/* Chat Interface */}
    <ChatInterface
      ref={chatInterfaceRef}
      campaignId={campaignId}
      // ... existing props
    />
  </div>
);
```

### 3. Add ContentEditable Message Handler

Add to useEffect in V2ChatEditor.tsx:

```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'contenteditable_change') {
      const { elementId, oldText, newText } = event.data;
      
      // Queue text update
      updateQueueRef.current?.queueUpdate({
        type: 'text',
        elementId,
        data: { oldText, newText },
      });
    }
  };
  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### 4. Add Exit Confirmation Modal

Add state and modal:

```typescript
const [showExitConfirmation, setShowExitConfirmation] = useState(false);

// In render:
{showExitConfirmation && (
  <ExitConfirmationModal
    open={showExitConfirmation}
    unsavedCount={updateQueueRef.current?.getQueueSize() || 0}
    onSave={async () => {
      await updateQueueRef.current?.flushQueue();
      setVisualEditMode(false);
      setShowExitConfirmation(false);
    }}
    onDiscard={() => {
      updateQueueRef.current?.clearQueue();
      setVisualEditMode(false);
      setShowExitConfirmation(false);
    }}
    onCancel={() => setShowExitConfirmation(false)}
  />
)}
```

### 5. Inject ContentEditable Script

Update HTML injection in V2ChatEditor:

```typescript
const displayHtml = isV2Campaign && visualEditMode 
  ? injectVisualEditorScript(injectContentEditableScript(currentHtmlContent))
  : currentHtmlContent;
```

### 6. Fix Update Queue Initialization

Fix the syntax error in the useEffect for update queue initialization (line 137):

```typescript
queue.onSave(async (updates) => {
  try {
    // Get filename from campaign - you'll need to fetch this
    const campaignResponse = await fetch(`/api/v2/campaigns/${campaignId}`);
    const campaignData = await campaignResponse.json();
    const filename = campaignData.campaign?.filename || `Email_${campaignId}.tsx`;
    
    const response = await fetch('/api/editor/batch-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, updates }),
    });
    
    if (!response.ok) {
      throw new Error('Batch update failed');
    }
    
    const result = await response.json();
    
    // Update HTML content
    if (result.newContent) {
      setCurrentHtmlContent(result.newContent);
      setRenderKey(prev => prev + 1);
    }
  } catch (error) {
    console.error('[V2ChatEditor] Batch save failed:', error);
    toast.error('Failed to save changes');
    throw error;
  }
});
```

## Testing Checklist

- [ ] Visual Edit button triggers DOM scan
- [ ] Scanning progress modal shows
- [ ] Property Inspector appears when element selected
- [ ] Property changes update preview instantly
- [ ] ContentEditable works on text click
- [ ] AI edits work via Property Inspector
- [ ] Updates batch and auto-save after 500ms
- [ ] Save status indicator updates
- [ ] Exit confirmation shows for unsaved changes
- [ ] TSX files update correctly

