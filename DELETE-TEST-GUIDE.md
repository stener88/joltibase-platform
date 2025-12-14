# 🧪 Delete Functionality Test Guide

**Purpose:** Verify that component deletion works correctly after disabling deterministic delete  
**Time Required:** 15 minutes  
**Status:** Ready for testing

---

## ✅ **Pre-Test Checklist**

Before starting tests:
- [ ] Dev server is running (`npm run dev`)
- [ ] You have an existing campaign open in the editor
- [ ] Browser DevTools are open (Console + Network tabs)
- [ ] You understand deletes will be slower (1-2 seconds) - **this is expected**

---

## 🎯 **Test Scenarios**

### **Test 1: Simple Component Delete** ⭐ CRITICAL
**Goal:** Verify basic delete works

**Steps:**
1. Open a campaign in the editor
2. Click on a simple component (Button, Text, or Img)
3. Click "Delete this" in the floating toolbar
4. Wait 1-2 seconds

**Expected Result:**
- ✅ Component disappears from preview
- ✅ No error messages
- ✅ Email still renders correctly
- ✅ See in Console: `"Delete request via AI (deterministic disabled)"`

**Red Flags:**
- ❌ "Unexpected closing tag" error
- ❌ Preview goes blank
- ❌ Takes > 5 seconds

---

### **Test 2: Nested Component Delete** ⭐ CRITICAL
**Goal:** Verify the bug fix - nested components should work now

**Steps:**
1. Find a `<Column>` that's inside another `<Column>` or `<Section>`
2. Click on the inner component
3. Click "Delete this"
4. Wait 1-2 seconds

**Expected Result:**
- ✅ Only the selected component is deleted
- ✅ Parent and sibling components remain intact
- ✅ No structure errors
- ✅ Preview updates correctly

**Red Flags:**
- ❌ Multiple components disappear
- ❌ Orphaned closing tags
- ❌ "Transform failed" error

---

### **Test 3: Component with Children Delete** ⭐ CRITICAL
**Goal:** Deleting a parent should remove all children

**Steps:**
1. Click on a `<Section>` that contains multiple `<Text>` or other components
2. Click "Delete this"
3. Wait 1-2 seconds

**Expected Result:**
- ✅ Entire section (parent + all children) is deleted
- ✅ Surrounding components shift up to fill space
- ✅ No orphaned child components
- ✅ Clean render

**Red Flags:**
- ❌ Children remain without parent
- ❌ Broken layout

---

### **Test 4: Multiple Sequential Deletes**
**Goal:** Verify stability with repeated operations

**Steps:**
1. Delete a component
2. Wait for success
3. Delete another component
4. Repeat 3-5 times

**Expected Result:**
- ✅ Each delete works independently
- ✅ No accumulated errors
- ✅ Campaign remains stable

**Red Flags:**
- ❌ Errors after 2nd or 3rd delete
- ❌ Preview freezes

---

### **Test 5: Delete Performance Check**
**Goal:** Measure AI processing time

**Steps:**
1. Open Network tab in DevTools
2. Delete a component
3. Find `POST /api/v3/campaigns/refine` request
4. Check response time

**Expected Result:**
- ✅ Response time: 1-3 seconds (acceptable)
- ✅ Status: 200 OK
- ✅ Response contains: `success: true`

**Red Flags:**
- ❌ > 5 seconds consistently
- ❌ 500 errors
- ❌ Timeouts

---

### **Test 6: Different Component Types**
**Goal:** Verify all component types can be deleted

Test deleting each of these:
- [ ] `<Button>` - Simple component
- [ ] `<Text>` - Text content
- [ ] `<Img>` - Image component
- [ ] `<Column>` - Layout component
- [ ] `<Section>` - Container component
- [ ] `<Row>` - Row layout
- [ ] `<Link>` - Link component

**Expected Result:**
- ✅ All types delete successfully
- ✅ Consistent behavior across types

---

## 📊 **Performance Benchmarks**

| Operation | Target | Acceptable | Red Flag |
|-----------|--------|------------|----------|
| Simple Delete | 1-2s | < 3s | > 5s |
| Nested Delete | 1-2s | < 3s | > 5s |
| AI Response | 1-2s | < 3s | > 5s |
| Render After Delete | Instant | < 500ms | > 2s |

---

## 🔍 **What to Look For in Logs**

### **Good Logs (Success):**
```
🔄 [REFINE-SDK] Delete request via AI (deterministic disabled)
🤖 [REFINE-SDK] Using AI for: "delete this"
✅ [REFINE-SDK] Successfully updated campaign
🎨 [RENDER-API] Rendering TSX with component IDs...
✅ [V3-RENDERER] Rendered successfully
```

### **Bad Logs (Failure):**
```
❌ [V3-RENDERER] Render error: Unexpected closing tag
ERROR: Transform failed with 5 errors
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Delete request via AI" but nothing happens**
**Cause:** AI might have misunderstood the command  
**Fix:** Try being more explicit: "remove the button component"

### **Issue 2: Delete works but takes 5+ seconds**
**Cause:** AI model overloaded or network issue  
**Fix:** Check internet connection, try again

### **Issue 3: Preview goes blank after delete**
**Cause:** Rendering error (shouldn't happen with AI deletes)  
**Fix:** 
1. Check console for errors
2. Try refresh
3. If persists, report as bug

### **Issue 4: Wrong component gets deleted**
**Cause:** Component selection unclear  
**Fix:** Click directly on component, wait for selection highlight

---

## ✅ **Success Criteria**

Test is **PASSED** if:
- ✅ All 6 test scenarios pass
- ✅ No "Unexpected closing tag" errors
- ✅ Delete time consistently < 3 seconds
- ✅ No campaign corruption

Test is **FAILED** if:
- ❌ Any rendering errors occur
- ❌ Campaigns get corrupted
- ❌ Delete time > 5 seconds consistently
- ❌ Error rate > 10%

---

## 📝 **Test Report Template**

```
Date: [DATE]
Tester: [YOUR NAME]
Environment: Local / Production

Test 1 - Simple Delete: ✅ / ❌
Test 2 - Nested Delete: ✅ / ❌
Test 3 - With Children: ✅ / ❌
Test 4 - Multiple Deletes: ✅ / ❌
Test 5 - Performance: [X.X seconds avg]
Test 6 - All Types: ✅ / ❌

Issues Found: [NONE / LIST ISSUES]

Overall Status: ✅ PASS / ❌ FAIL

Notes:
- [Any observations]
- [Performance notes]
- [User experience feedback]
```

---

## 🚀 **Production Test (After Deployment)**

**After deploying to production:**

1. **Smoke Test** (5 min):
   - Create new campaign
   - Add a few components
   - Delete one
   - Verify it works

2. **Monitor** (24 hours):
   - Check error logs
   - Watch for support tickets
   - Track delete frequency
   - Measure AI costs

3. **User Feedback**:
   - Ask 2-3 beta users to test
   - Gather speed perception feedback
   - Check if anyone notices the change

---

## 📞 **Reporting Issues**

If you find bugs:

1. **Capture:**
   - Screenshot of error
   - Console logs
   - Network tab (refine API call)
   - Steps to reproduce

2. **Document:**
   - What component you tried to delete
   - What happened vs expected
   - Campaign ID (if applicable)

3. **Report:**
   - Create GitHub issue
   - Tag as `P0` if data loss risk
   - Include all captured info

---

## 🎯 **Next Steps After Testing**

- [ ] Complete all 6 test scenarios
- [ ] Fill out test report
- [ ] Deploy to production if passed
- [ ] Monitor for 24 hours
- [ ] Schedule Babel AST implementation (permanent fix)

---

**Ready to test?** 🚀  
Start with **Test 1** and work through sequentially.  
Good luck! 🍀
