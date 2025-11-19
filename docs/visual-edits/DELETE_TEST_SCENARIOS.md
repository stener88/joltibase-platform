# Visual Edits Delete - Test Scenarios

## Test Coverage Plan

Use this document to systematically test the delete functionality across all element types and behaviors.

---

## ✅ Category A: Simple Blocks (Delete Entire Block)

### Test 1.1: Delete Text Block
**Setup:** Campaign with a text block

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on text block
3. Verify floating toolbar appears
4. Hover over trash icon
5. Verify tooltip shows "Delete Block"
6. Click trash icon
7. Verify SaveDiscardBar appears showing "1 change"
8. Click Save
9. Verify text block is completely removed from email

**Expected:** ✅ Block removed, positions re-indexed

---

### Test 1.2: Delete Button Block (Standalone)
**Setup:** Campaign with standalone button block (not in a layout)

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on button
3. Verify tooltip shows "Delete Block"
4. Click trash icon
5. Click Save
6. Verify entire button block removed

**Expected:** ✅ Block removed

---

### Test 1.3: Delete Image Block
**Steps:** Same as above for image block

**Expected:** ✅ Block removed

---

### Test 1.4: Delete Logo Block
**Steps:** Same as above for logo block

**Expected:** ✅ Block removed

---

### Test 1.5: Delete Spacer Block
**Steps:** Same as above for spacer block

**Expected:** ✅ Block removed

---

### Test 1.6: Delete Divider Block
**Steps:** Same as above for divider block

**Expected:** ✅ Block removed

---

## ✅ Category B: Layout Elements (Clear Content)

### Test 2.1: Delete Title in Hero Block
**Setup:** Campaign with hero-center layout containing title

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on hero title text
3. Verify tooltip shows "Clear Content"
4. Click trash icon
5. Verify SaveDiscardBar appears
6. Click Save
7. Verify title text is empty BUT hero block still exists

**Expected:** ✅ Title cleared, hero structure preserved

---

### Test 2.2: Delete Paragraph in Card Layout
**Setup:** Campaign with card-centered layout containing paragraph

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on card paragraph
3. Verify tooltip shows "Clear Content"
4. Click trash icon
5. Click Save
6. Verify paragraph text cleared, card block remains

**Expected:** ✅ Content cleared, layout preserved

---

### Test 2.3: Delete Subtitle in Magazine Feature
**Setup:** Campaign with magazine-feature layout containing subtitle

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on subtitle
3. Verify tooltip shows "Clear Content"
4. Click trash icon
5. Click Save
6. Verify subtitle cleared

**Expected:** ✅ Subtitle text cleared

---

### Test 2.4: Delete Button in Two-Column Layout
**Setup:** Campaign with two-column layout containing button

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on button within layout
3. Verify tooltip shows "Clear Button Text"
4. Click trash icon
5. Click Save
6. Verify button text cleared, but button structure remains

**Expected:** ✅ Button text cleared, layout preserved

---

### Test 2.5: Delete Header in Layout
**Steps:** Same as above for header element in layout

**Expected:** ✅ Header text cleared

---

## ✅ Category C: Collection Items (Remove from Array)

### Test 3.1: Delete Stat from 4-Column Stats
**Setup:** Campaign with stats-4-col layout

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on second stat value
3. Verify tooltip shows "Remove Stat Item"
4. Click trash icon
5. Verify SaveDiscardBar appears
6. Click Save
7. Verify:
   - Second stat completely removed
   - Only 3 stats remain
   - Layout adjusts to 3 columns

**Expected:** ✅ Stat removed, array reduced, layout adjusts

---

### Test 3.2: Delete Stat from 3-Column Stats
**Setup:** Campaign with stats-3-col layout

**Steps:** Same as above

**Expected:** ✅ Stats reduced to 2 columns

---

### Test 3.3: Delete Stat from 2-Column Stats
**Setup:** Campaign with stats-2-col layout

**Steps:** Same as above

**Expected:** ✅ Stats reduced to 1 column

---

### Test 3.4: Delete Last Stat
**Setup:** Campaign with stats block containing only 1 stat

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on the single stat
3. Click trash icon
4. Click Save
5. Verify:
   - Stat removed from array
   - Stats block remains with empty array
   - Block renders as empty (or minimal)

**Expected:** ✅ Stat removed, empty stats block remains

---

### Test 3.5: Delete Social Link
**Setup:** Campaign with social-links block containing 4 links

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on third social link icon
3. Verify tooltip shows "Remove Link"
4. Click trash icon
5. Click Save
6. Verify:
   - Third link removed
   - Only 3 links remain
   - Layout adjusts

**Expected:** ✅ Link removed from array

---

### Test 3.6: Delete All Social Links One by One
**Setup:** Campaign with social-links block containing 3 links

**Steps:**
1. Delete first link → Save
2. Delete second link → Save
3. Delete third link → Save
4. Verify social-links block remains with empty links array

**Expected:** ✅ All links removed, block remains

---

## ✅ Category D: Footer Elements

### Test 4.1: Try to Delete Company Name (Required)
**Setup:** Campaign with footer block

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on company name
3. Verify floating toolbar appears
4. Verify trash icon is NOT shown
5. Verify only AI input, Add, Content, Styles buttons shown

**Expected:** ✅ Trash icon hidden for required field

---

### Test 4.2: Try to Delete Company Address (Required)
**Steps:** Same as above for company address

**Expected:** ✅ Trash icon hidden

---

### Test 4.3: Try to Delete Unsubscribe Link (Required)
**Steps:** Same as above for unsubscribe link

**Expected:** ✅ Trash icon hidden

---

### Test 4.4: Try to Delete Preferences Link (Required)
**Steps:** Same as above for preferences link

**Expected:** ✅ Trash icon hidden

---

### Test 4.5: Delete Custom Footer Text (Optional)
**Setup:** Campaign with footer containing custom text

**Steps:**
1. Toggle Visual Edits mode ON
2. Click on custom footer text
3. Verify trash icon IS shown
4. Verify tooltip shows "Clear Content"
5. Click trash icon
6. Click Save
7. Verify custom text cleared

**Expected:** ✅ Optional footer text cleared

---

## ✅ Category E: State Management & UX

### Test 5.1: Delete Shows SaveDiscardBar
**Steps:**
1. Delete any element
2. Verify SaveDiscardBar appears at bottom
3. Verify it shows "1 change pending" (or similar)

**Expected:** ✅ SaveDiscardBar appears

---

### Test 5.2: Delete → Save → Changes Applied
**Steps:**
1. Delete a text block
2. Click Save
3. Verify block removed
4. Verify visual edits mode exits
5. Verify SaveDiscardBar disappears

**Expected:** ✅ Changes applied, mode exits

---

### Test 5.3: Delete → Discard → Changes Reverted
**Steps:**
1. Delete a text block
2. Click Discard
3. Verify block still exists
4. Verify visual edits mode exits
5. Verify SaveDiscardBar disappears

**Expected:** ✅ Changes reverted, mode exits

---

### Test 5.4: Multiple Changes Including Delete
**Steps:**
1. Edit text in first block
2. Delete second block
3. Change color in third block
4. Verify SaveDiscardBar shows "3 changes"
5. Click Save
6. Verify all changes applied

**Expected:** ✅ All changes applied correctly

---

### Test 5.5: Multiple Deletes in Sequence
**Steps:**
1. Delete first block → SaveDiscardBar shows "1 change"
2. (Don't save yet) Delete second block
3. Verify SaveDiscardBar now shows "2 changes"
4. Click Save
5. Verify both blocks removed

**Expected:** ⚠️ **Known Limitation:** Only last delete's updated blocks used
**Current Workaround:** Users should save after each delete

---

### Test 5.6: Delete → Select Another Element
**Steps:**
1. Delete a block (don't save)
2. Click on another element
3. Verify new element is selected
4. Verify SaveDiscardBar still shows pending delete

**Expected:** ✅ Can continue editing with pending delete

---

## ✅ Category F: Edge Cases

### Test 6.1: Delete Parent Block After Clearing Child
**Steps:**
1. Clear content from hero title (Clear Content behavior)
2. Save
3. Click on parent hero block
4. Delete entire hero block
5. Save
6. Verify entire hero block removed

**Expected:** ✅ Can delete empty layout blocks

---

### Test 6.2: Rapid Delete Clicks
**Steps:**
1. Click trash icon multiple times rapidly
2. Verify only one delete operation registered

**Expected:** ✅ No duplicate deletes

---

### Test 6.3: Delete Without Selecting Element
**Steps:**
1. Try calling deleteElement() without selected element
2. Verify graceful error handling

**Expected:** ✅ No crash, returns false

---

### Test 6.4: Delete Non-Existent Block
**Steps:**
1. Select element
2. Manually change block ID in state
3. Try to delete
4. Verify error handling

**Expected:** ✅ Returns error, no crash

---

## 🎯 Test Summary Checklist

### Simple Blocks (6 tests)
- [ ] Text block
- [ ] Button block (standalone)
- [ ] Image block
- [ ] Logo block
- [ ] Spacer block
- [ ] Divider block

### Layout Elements (5 tests)
- [ ] Title in hero
- [ ] Paragraph in card
- [ ] Subtitle in magazine
- [ ] Button in layout
- [ ] Header in layout

### Collection Items (6 tests)
- [ ] Delete stat from 4-col
- [ ] Delete stat from 3-col
- [ ] Delete stat from 2-col
- [ ] Delete last stat
- [ ] Delete social link
- [ ] Delete all social links

### Footer Elements (5 tests)
- [ ] Company name (required)
- [ ] Company address (required)
- [ ] Unsubscribe link (required)
- [ ] Preferences link (required)
- [ ] Custom text (optional)

### State Management (6 tests)
- [ ] SaveDiscardBar appears
- [ ] Save applies changes
- [ ] Discard reverts changes
- [ ] Multiple changes including delete
- [ ] Multiple deletes (known limitation)
- [ ] Delete + continue editing

### Edge Cases (4 tests)
- [ ] Delete parent after clearing child
- [ ] Rapid delete clicks
- [ ] Delete without selection
- [ ] Delete non-existent block

---

## 📝 Bug Report Template

If you find issues during testing, use this template:

```
**Test:** [Test number and name]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Steps to Reproduce:**
1. 
2. 
3. 

**Environment:**
- Browser: 
- Campaign ID:
- Element Type:

**Screenshots/Logs:**
[Attach if available]
```

---

## ✅ Sign-Off

When all tests pass, QA engineer signs off:

- **Tester Name:** __________________
- **Date:** __________________
- **Tests Passed:** _____ / 32
- **Critical Bugs Found:** _____
- **Status:** [ ] PASS  [ ] FAIL

---

Ready for production: ✅ / ❌

