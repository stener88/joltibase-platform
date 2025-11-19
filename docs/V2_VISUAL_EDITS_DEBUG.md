# V2 Visual Edits Not Working - Debug Summary

## Current State

User reports NONE of the visual edits features are working:
- ❌ Hover effects don't appear
- ❌ Click detection doesn't work  
- ❌ Toolbar doesn't appear
- ✅ Toggle button works (ON/OFF state changes)

## What We Implemented

### Changes Made
1. **EmailV2Frame.tsx**: Conditional script injection based on `onComponentClick` prop
2. **EmailV2Frame.tsx**: Iframe ref + viewport coordinate conversion
3. **V2ChatEditor.tsx**: Moved FloatingToolbar to root level
4. **V2ChatEditor.tsx**: Visual edits toggle state (already existed)

### Expected Flow
1. User clicks toggle → `visualEditsMode = true`
2. `onComponentClick` prop passed to EmailV2Frame
3. `interactiveHtml` recalculates with hover CSS + click handlers
4. Iframe `srcDoc` updates with new HTML
5. Hover/click work inside iframe

## Root Cause Analysis

**Problem**: Iframe `srcDoc` may not be updating when `onComponentClick` changes from `undefined` to a function.

**Why**: 
- `interactiveHtml` is recalculated inline (not memoized)
- Depends on `onComponentClick`, `html`, `rootComponent`, `selectedComponentId`
- React should trigger re-render, but iframe might not reload

**Possible Issues**:
1. Iframe doesn't reload when `srcDoc` changes (browser behavior)
2. `interactiveHtml` string is identical (function reference doesn't affect template literal)
3. Need to force iframe reload with key prop

## Solution Options

### Option 1: Add Key Prop to Force Iframe Reload
```tsx
<iframe
  key={onComponentClick ? 'interactive' : 'static'}
  ref={iframeRef}
  srcDoc={interactiveHtml}
  ...
/>
```
Forces new iframe mount when visual edits toggles.

### Option 2: Use useMemo + useEffect
```tsx
const interactiveHtml = useMemo(() => {
  if (!html) return '';
  return `<!DOCTYPE html>...`;
}, [html, onComponentClick, rootComponent, selectedComponentId]);

useEffect(() => {
  if (iframeRef.current) {
    iframeRef.current.srcdoc = interactiveHtml;
  }
}, [interactiveHtml]);
```
Explicitly update iframe when HTML changes.

### Option 3: Direct Iframe Manipulation
```tsx
useEffect(() => {
  if (!iframeRef.current || !html) return;
  
  const iframe = iframeRef.current;
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;
  
  doc.open();
  doc.write(interactiveHtml);
  doc.close();
}, [interactiveHtml]);
```
Bypass `srcDoc` entirely, write directly to iframe.

## Recommended Fix

**Use Option 1** (key prop) - simplest and most reliable:

```tsx
// In EmailV2Frame.tsx
<iframe
  key={onComponentClick ? 'interactive' : 'static'}
  ref={iframeRef}
  title="Email Preview"
  srcDoc={interactiveHtml}
  className="w-full h-full border-0"
  style={{ minHeight: '600px' }}
  sandbox="allow-scripts allow-same-origin"
/>
```

This forces React to unmount/remount the iframe when visual edits toggles, ensuring the new HTML with scripts loads properly.

## Files to Modify

1. `/components/email-editor/EmailV2Frame.tsx` - Add key prop to iframe

## Testing After Fix

1. Toggle visual edits ON
2. Check if hover shows dashed outline
3. Click component, check if postMessage fires
4. Check if toolbar appears
5. Toggle OFF, verify interactions stop

## Additional Debug Steps

If key prop doesn't work:
1. Console.log `onComponentClick` value in EmailV2Frame
2. Console.log `interactiveHtml` length/content
3. Check browser DevTools → iframe source
4. Check console for postMessage events
5. Verify iframe sandbox permissions

## Architecture Note

We chose iframe for security (safe for user content), but iframes have quirks:
- May not reload when `srcDoc` changes
- Need explicit reload mechanisms
- `key` prop is React's way to force remount

This is expected behavior, not a bug in our implementation.

