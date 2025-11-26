<!-- fdf1c942-2202-4e2a-8e89-d321b220d4dc f377dd47-e009-4d41-a35d-c52b75fc9e0d -->
# Instant Property Updates Plan

## Goal

Enable instant property updates without page reloads by mapping clicked elements to their props and updating instanceProps directly.

## Architecture

**Manual Edits (PropertyInspector)** → Update `instanceProps` → Instant re-render

**AI Edits (FloatingQuickEdit)** → Update TSX code → Page reload

## Implementation Steps

### 1. Update AI Generation Prompt

**File:** `lib/email-v2/ai/prompts-v2.ts` or `emails/lib/generator.ts`

Add rule to system prompt:

```typescript
6. **DATA ATTRIBUTES FOR EDITING**
   - Add data-prop-name attribute to elements that use props
   - Example: <Heading data-prop-name="headline">{headline}</Heading>
   - Example: <Text data-prop-name="introduction">{introduction}</Text>
   - This enables instant visual editing without reloads
```

### 2. Extract data-prop-name on Click

**File:** `components/email-editor/V2ChatEditor.tsx`

In the click handler (around line 112), extract the prop name:

```typescript
const handleClick = (e: Event) => {
  const target = e.target as HTMLElement;
  const propName = target.getAttribute('data-prop-name') || undefined;
  
  setV2SelectedContext({
    type: contextType,
    tagName: tagName,
    currentText: textContent,
    currentStyles: currentStyles,
    propName: propName,  // Add this!
  });
};
```

### 3. Update ComponentContext Interface

**File:** `emails/lib/visual-editor.ts`

Add `propName` to the interface:

```typescript
export interface ComponentContext {
  type: 'text' | 'heading' | 'button' | 'image' | 'section' | 'container';
  tagName?: string;
  currentText?: string;
  currentStyles?: Record<string, string>;
  propName?: string;  // Add this line
  editId?: string;
  parentContext?: string;
}
```

### 4. Implement Instant Property Updates

**File:** `components/email-editor/V2ChatEditor.tsx`

Replace the `handlePropertyChange` function (around line 166):

```typescript
const handlePropertyChange = useCallback((property: string, value: string | number) => {
  if (!v2SelectedContext?.propName) {
    console.warn('No propName found for instant update');
    return;
  }
  
  // For text content, update the prop directly
  if (property === 'text') {
    const updatedProps = { 
      ...instanceProps, 
      [v2SelectedContext.propName]: value 
    };
    setInstanceProps(updatedProps);
    
    // Save to database in background
    fetch(`/api/v2/campaigns/${campaignId}/property-edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instance_props: updatedProps }),
    }).catch(err => console.error('Save failed:', err));
    
    return;
  }
  
  // For styles (color, font, etc.), use AI to update TSX
  // These require modifying the component code structure
  handleAIEdit(`Change the ${property} to ${value}`);
}, [instanceProps, campaignId, v2SelectedContext, handleAIEdit]);
```

### 5. Update PropertyInspector

**File:** `components/email-editor/PropertyInspector.tsx`

Show prop name when available:

```typescript
<label className="block text-xs font-medium text-[#6b6b6b] mb-2">
  Content {selectedContext.propName && `(${selectedContext.propName})`}
</label>
```

Add indicator when instant updates are available:

```typescript
{selectedContext.propName && (
  <p className="text-xs text-green-600 mb-2">
    ✓ Instant updates enabled
  </p>
)}
```

### 6. Style Changes Strategy

**Decision Point:** Styling changes (colors, fonts) require modifying inline style objects in TSX.

**Options:**

- **Option A (Simpler):** All style changes use AI (handleAIEdit)
- **Option B (Advanced):** Parse TSX to find and update style objects programmatically

**Recommendation:** Start with Option A - use AI for style changes. Most users will be happy with instant text updates.

### 7. Update FloatingQuickEdit Behavior

**File:** `components/email-editor/FloatingQuickEdit.tsx`

Add help text explaining when to use it:

```typescript
<p className="text-xs text-gray-500 mb-2">
  For layout, structure, or style changes
</p>
```

### 8. Test Flow

1. Generate new email with updated prompt
2. Click element with data-prop-name
3. Edit text in PropertyInspector
4. Verify instant update (no reload)
5. Test style changes via FloatingQuickEdit
6. Verify database saves in background

## Files to Modify

- `lib/email-v2/ai/prompts-v2.ts` - Add data-prop-name rule
- `emails/lib/generator.ts` - Update system prompt
- `emails/lib/visual-editor.ts` - Add propName to ComponentContext
- `components/email-editor/V2ChatEditor.tsx` - Extract propName, instant updates
- `components/email-editor/PropertyInspector.tsx` - Show prop name, instant update indicator
- `components/email-editor/FloatingQuickEdit.tsx` - Add help text

## Expected Outcome

- Click element → See prop name in PropertyInspector
- Edit text → **Instant update** in iframe (no reload!)
- Edit color/font → FloatingQuickEdit AI edit (with reload)
- Database saves happen in background
- Users get instant feedback for 90% of edits

### To-dos

- [x] Remove extractDefaultPropsFromTSX and smart detection logic
- [x] Replace complex click handler with simple version
- [x] Replace hover CSS classes with simple hover outline
- [x] Verify final file is ~310 lines