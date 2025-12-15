# 🧪 Smart Duplicate Test Guide

**Purpose:** Verify that Babel AST-based duplication works correctly  
**Time Required:** 10 minutes  
**Status:** Ready for testing

---

## ✅ **Pre-Test Checklist**

- [ ] Dev server running (`npm run dev`)
- [ ] Campaign open in editor
- [ ] Browser DevTools open (Console tab)
- [ ] Understand duplicates will have different IDs (this is correct!)

---

## 🎯 **Test Scenarios**

### **Test 1: Simple Component Duplicate** ⭐ CRITICAL
**Goal:** Verify basic duplication works

**Steps:**
1. Open a campaign in the editor
2. Click on a simple component (Button, Text, or Img)
3. Type `"duplicate this"` in the toolbar or chat
4. Wait ~50ms (instant)

**Expected Result:**
- ✅ Component appears twice (original + duplicate)
- ✅ Both look identical visually
- ✅ When you click each one, different IDs are shown
- ✅ Console shows: `"⚡ [REFINE-SDK] SMART DUPLICATE - Using Babel AST"`
- ✅ Console shows: `"📝 Updated ID: cmp-X → cmp-[timestamp]-[random]"`

**How to Verify IDs:**
- Click original → Shows `data-component-id="cmp-5"` (example)
- Click duplicate → Shows `data-component-id="cmp-1734567890123-x7k9m"`

**Red Flags:**
- ❌ Both components have same ID (broken)
- ❌ Duplicate doesn't appear
- ❌ Console shows "Falling back to simple duplicate"

---

### **Test 2: Nested Component Duplicate** ⭐ CRITICAL
**Goal:** Verify ALL nested IDs are updated

**Steps:**
1. Find a `<Section>` or `<Column>` that contains other components
2. Click on the parent component
3. Type `"duplicate this"`
4. Click on the original nested child
5. Click on the duplicate nested child

**Expected Result:**
- ✅ Entire section duplicates (parent + all children)
- ✅ Parent has new ID
- ✅ ALL children have new IDs
- ✅ Console shows multiple ID updates:
  ```
  📝 Updated ID: cmp-5 → cmp-[new]
  📝 Updated ID: cmp-6 → cmp-[new]
  📝 Updated ID: cmp-7 → cmp-[new]
  ```

**Example:**
```tsx
// Before:
<Section id="cmp-10">
  <Text id="cmp-11">Title</Text>
  <Button id="cmp-12">CTA</Button>
</Section>

// After duplicate:
<Section id="cmp-10">...</Section>  ← Original
<Section id="cmp-1734567890123-abc">  ← Duplicate
  <Text id="cmp-1734567890124-def">Title</Text>  ← New ID
  <Button id="cmp-1734567890125-ghi">CTA</Button>  ← New ID
</Section>
```

**Red Flags:**
- ❌ Child components have same IDs as originals
- ❌ Only parent ID changes, children stay same
- ❌ Clicking child in original vs duplicate shows same ID

---

### **Test 3: Self-Closing Component**
**Goal:** Verify `<Img />` and similar components work

**Steps:**
1. Click an image component (`<Img />`)
2. Type `"duplicate this"`

**Expected Result:**
- ✅ Image duplicates
- ✅ New ID assigned
- ✅ Both images render correctly

**Red Flags:**
- ❌ Image disappears
- ❌ Only one image visible
- ❌ Broken image rendering

---

### **Test 4: Complex Component with Props**
**Goal:** Verify all props are preserved

**Steps:**
1. Click a component with many props (Button with href, style, className)
2. Type `"duplicate this"`
3. Inspect both components in the preview

**Expected Result:**
- ✅ All props preserved (href, style, className, etc.)
- ✅ Only `data-component-id` changes
- ✅ Visual appearance identical
- ✅ Links/buttons both work

**Example:**
```tsx
<Button 
  href="https://example.com"
  style={{ backgroundColor: '#007bff', color: '#fff' }}
  className="px-4 py-2 rounded"
  data-component-id="cmp-15"
>
  Buy Now
</Button>

// Duplicate should have ALL these props + new ID
```

**Red Flags:**
- ❌ Props missing in duplicate
- ❌ Styles don't match
- ❌ Link doesn't work in duplicate

---

### **Test 5: Multiple Sequential Duplicates**
**Goal:** Verify stability with repeated operations

**Steps:**
1. Duplicate a component
2. Click the duplicate
3. Duplicate it again
4. Repeat 3-5 times

**Expected Result:**
- ✅ Each duplicate gets unique ID
- ✅ No ID collisions
- ✅ All components selectable independently
- ✅ Performance stays fast (<100ms each)

**Red Flags:**
- ❌ IDs start conflicting after 2nd duplicate
- ❌ Performance degrades
- ❌ Selection breaks

---

### **Test 6: Different Component Types**
**Goal:** Verify all component types work

Test duplicating each:
- [ ] `<Button>` - Interactive component
- [ ] `<Text>` - Text content
- [ ] `<Img>` - Self-closing image
- [ ] `<Column>` - Layout component
- [ ] `<Section>` - Container
- [ ] `<Row>` - Row layout
- [ ] `<Link>` - Link component

**Expected Result:**
- ✅ All types duplicate successfully
- ✅ Consistent behavior across types
- ✅ Unique IDs for each

---

## 🔍 **What to Look For in Console**

### **Good Logs (Success):**
```
⚡ [REFINE-SDK] SMART DUPLICATE - Using Babel AST
  📝 Updated ID: cmp-5 → cmp-1734567890123-x7k9m
  📝 Updated ID: cmp-6 → cmp-1734567890124-a2b3c
  ✅ Duplicated Section with updated IDs
```

### **Warning Logs (Fallback - Not Ideal):**
```
❌ [REFINE-SDK] Smart duplicate failed: [error]
  ⚠️ Falling back to simple duplicate
```
**Note:** If you see this, report it! Fallback works but IDs won't update.

### **Bad Logs (Failure):**
```
❌ [REFINE-SDK] Error: [something]
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Fallback to simple duplicate" in console**
**Cause:** Babel parsing failed (rare)  
**Impact:** Duplicate works but IDs don't update  
**Action:** Report the exact error message

### **Issue 2: Duplicate appears but both have same ID**
**Cause:** Fallback was used  
**Fix:** Check console for error, report bug

### **Issue 3: Duplicate takes >500ms**
**Cause:** Large component with many children  
**Action:** Normal for complex components, but report if >2 seconds

### **Issue 4: IDs are random gibberish**
**Cause:** This is CORRECT! Format: `cmp-[timestamp]-[random]`  
**Why:** Ensures uniqueness across all components

---

## 📊 **Performance Benchmarks**

| Operation | Target | Acceptable | Red Flag |
|-----------|--------|------------|----------|
| Simple Duplicate | <50ms | <100ms | >500ms |
| Nested Duplicate | <100ms | <200ms | >1s |
| Complex Component | <150ms | <300ms | >2s |
| ID Generation | Instant | Instant | N/A |

---

## ✅ **Success Criteria**

Test is **PASSED** if:
- ✅ All 6 test scenarios pass
- ✅ No ID conflicts
- ✅ All duplicates selectable independently
- ✅ Console shows "Using Babel AST"
- ✅ No "Falling back" warnings

Test is **FAILED** if:
- ❌ Duplicate IDs occur
- ❌ Components break visually
- ❌ Console shows errors
- ❌ Fallback used consistently

---

## 🔬 **Advanced Testing (Optional)**

### **Test 7: Stress Test**
1. Create a complex section with 10+ nested components
2. Duplicate it
3. Verify all 10+ IDs updated

### **Test 8: Edge Case - Fragment**
```tsx
<>
  <Text>A</Text>
  <Text>B</Text>
</>
```
Try duplicating (may not work - fragments are tricky)

### **Test 9: Props with Functions**
```tsx
<Button onClick={() => alert('clicked')}>
```
Duplicate and verify button works

---

## 📝 **Test Report Template**

```
Date: [DATE]
Tester: [YOUR NAME]
Environment: Local / Production

Test 1 - Simple Duplicate: ✅ / ❌
Test 2 - Nested Duplicate: ✅ / ❌
Test 3 - Self-Closing: ✅ / ❌
Test 4 - Complex Props: ✅ / ❌
Test 5 - Multiple Duplicates: ✅ / ❌
Test 6 - All Types: ✅ / ❌

Performance: [avg time in ms]
ID Conflicts: [none / list any]
Fallback Triggered: [yes / no]

Issues Found: [NONE / LIST ISSUES]

Overall Status: ✅ PASS / ❌ FAIL

Notes:
- [Any observations]
- [Performance notes]
- [User experience feedback]
```

---

## 🔍 **How to Inspect Component IDs**

### **Method 1: Click Component**
- Click component in preview
- Check browser DevTools Elements tab
- Look for `data-component-id="..."`

### **Method 2: Console Log**
The system logs ID updates when duplicating

### **Method 3: TSX Code View**
- Some editors show the raw TSX
- Search for `data-component-id`

---

## 🚀 **Next Steps After Testing**

- [ ] Complete all test scenarios
- [ ] Fill out test report
- [ ] Report any issues found
- [ ] If all pass, mark feature as ✅ STABLE
- [ ] Move to next Babel feature (Style Editor?)

---

**Ready to test?** 🚀  
Start with **Test 1** and work through sequentially.  
Expected time: 10 minutes total.

Good luck! 🍀
