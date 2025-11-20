# Preview/Edit Mode Fixes Applied

## Issues Addressed

### ✅ 1. Scroll Within Iframe (FIXED)
**Problem:** Scrollbar was inside the iframe instead of the main window

**Solution:**
- Moved `overflow-auto` to the parent container
- Made iframe auto-resize to content height using `onLoad` handler
- Iframe now expands to full content, parent handles scrolling

**Files Modified:**
- `components/email-editor/V2ChatEditor.tsx` (Line 524-536)
- `components/email-editor/EmailV2Frame.tsx` (Line 353-373)

### ✅ 2. Background Color Framing (FIXED)
**Problem:** Background color was contained within 600px frame instead of filling viewport

**Solution:**
- Removed fixed-width container (`600px`) around iframe
- Removed `mx-auto` centering and `bg-white` wrapper
- Iframe now fills full width, allowing email's background to extend naturally
- The email content itself still centers via the `Container` component (max-width: 600px)

**Result:** Background color now extends to fill the entire preview area, matching the regular campaign preview

### ❓ 3. Empty Footer (NEEDS CLARIFICATION)
**Status:** Unable to reproduce without seeing the actual campaign

**Possible causes:**
1. Visual spacing from background color (not an actual footer element)
2. Footer block with minimal/missing content
3. Extra margin/padding below email content

**Need from user:**
- Screenshot showing the empty footer
- Campaign ID or semantic blocks to debug
- Is this in Preview mode, Visual Edit mode, or both?

## Technical Details

### Iframe Auto-Resize Implementation

```typescript
<iframe
  srcDoc={htmlContent}
  className="w-full border-0"
  style={{ 
    minHeight: '100vh',
    height: '1px', // Trick to make iframe expand
  }}
  onLoad={(e) => {
    // Auto-resize to content height
    const iframe = e.currentTarget;
    if (iframe.contentWindow) {
      const height = iframe.contentWindow.document.documentElement.scrollHeight;
      iframe.style.height = `${height}px`;
    }
  }}
/>
```

### Email Structure (for reference)
```
<Html>
  <Body style="backgroundColor: {globalSettings.backgroundColor}">
    <Container style="maxWidth: 600px, margin: 0 auto">
      <!-- All email content blocks here -->
    </Container>
  </Body>
</Html>
```

- `Body`: Fills viewport with background color
- `Container`: Centers content at 600px max-width
- Blocks: Rendered inside Container

## Testing Checklist

- [x] Preview mode: Scroll in main window (not iframe)
- [x] Visual edit mode: Scroll in main window (not iframe)
- [x] Background color fills full width
- [x] Email content centered at 600px
- [ ] Empty footer issue - awaiting clarification

## Next Steps

1. **User to clarify empty footer**:
   - Provide screenshot
   - Specify which mode (preview/edit)
   - Share campaign semantic blocks if possible

2. **If it's a real footer block**: Check AI generation to see why it's empty

3. **If it's visual spacing**: May need to adjust body/container padding

## Current Status

✅ Scrolling: Fixed - parent window handles scroll
✅ Background: Fixed - extends to full viewport
❓ Empty footer: Needs user input to diagnose

