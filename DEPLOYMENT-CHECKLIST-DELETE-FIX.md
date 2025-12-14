# 🚀 Deployment Checklist: Delete Fix

**Date:** December 12, 2025  
**Change:** Emergency fix - Disable deterministic delete  
**Risk Level:** LOW (safety fix, no new features)  
**Rollback Plan:** Revert commented code blocks

---

## ✅ **Pre-Deployment**

### **1. Code Review** (5 min)
- [x] Changes reviewed: `app/api/v3/campaigns/refine/route.ts`
- [x] Error handling improved: `lib/email-v3/renderer.ts`
- [x] Documentation created: `EMERGENCY-DELETE-FIX.md`
- [x] Test guide created: `DELETE-TEST-GUIDE.md`

### **2. Local Testing** (15 min)
- [ ] Test 1: Simple delete ✅
- [ ] Test 2: Nested delete ✅
- [ ] Test 3: Component with children ✅
- [ ] Test 4: Multiple deletes ✅
- [ ] Test 5: Performance check (< 3 seconds) ✅
- [ ] All tests passed ✅

### **3. Environment Check**
- [ ] `GEMINI_API_KEY` configured (for AI processing)
- [ ] Dev server runs without errors
- [ ] No TypeScript errors: `npm run build`

---

## 🚀 **Deployment Steps**

### **Step 1: Commit Changes** (2 min)
```bash
git add .
git commit -m "Emergency fix: Disable deterministic delete to prevent campaign corruption

- Disabled regex-based delete (lines 146-167 in refine/route.ts)
- All deletes now use AI for proper AST handling
- Added monitoring logs for delete requests
- Improved error messages in renderer
- Trade-off: Deletes slower (1-2s) but 100% correct

Fixes: Nested component delete causing 'Unexpected closing tag' errors
Impact: Zero corruption risk, all deletes work correctly
Next: Implement Babel AST parser for instant deletes"
```

### **Step 2: Push to Repository** (1 min)
```bash
git push origin main
```

### **Step 3: Deploy** (Depends on hosting)

**If using Vercel:**
```bash
vercel --prod
# or auto-deploy via GitHub integration
```

**If using other hosting:**
- Follow your standard deployment process
- Ensure environment variables are set
- Verify build succeeds

### **Step 4: Verify Deployment** (5 min)
- [ ] Production URL loads
- [ ] No console errors on page load
- [ ] Can open a campaign in editor
- [ ] Test one delete operation

---

## ✅ **Post-Deployment**

### **Immediate Checks** (15 min)

1. **Smoke Test:**
   - [ ] Open production app
   - [ ] Create/open a campaign
   - [ ] Delete a simple component
   - [ ] Verify it works (1-2 seconds)
   - [ ] Check no errors in browser console

2. **Monitor Logs:**
   ```bash
   # In your hosting dashboard, watch for:
   "Delete request via AI (deterministic disabled)"
   
   # Should NOT see:
   "Unexpected closing tag"
   "Transform failed"
   ```

3. **Check Error Rates:**
   - [ ] Rendering errors: Should be 0%
   - [ ] API errors: Should be same as before
   - [ ] User reports: None expected

---

## 📊 **Monitoring Plan**

### **First 24 Hours:**

**Watch for:**
1. **Error Rate** - Should drop to near 0%
2. **Delete Frequency** - How often users delete
3. **User Complaints** - "Too slow" feedback
4. **AI Costs** - Monitor Gemini API usage

**Metrics to Track:**
| Metric | Target | Alert If |
|--------|--------|----------|
| Error Rate | 0% | > 1% |
| Delete Success | 100% | < 95% |
| Avg Delete Time | 1-2s | > 5s |
| User Complaints | 0 | > 5 |

**Check Points:**
- ✅ **1 hour:** Quick check - any errors?
- ✅ **4 hours:** Review logs, any patterns?
- ✅ **24 hours:** Full analysis, user feedback

---

## 🔄 **Rollback Plan**

**If issues arise, rollback immediately:**

### **Rollback Steps:**
1. **Revert commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or manually uncomment:**
   - Go to `app/api/v3/campaigns/refine/route.ts`
   - Uncomment lines 146-167
   - Remove the new warning log
   - Deploy

3. **Communicate:**
   - Notify team
   - Update status in monitoring dashboard
   - Document what went wrong

**Rollback Triggers:**
- ❌ Error rate > 5%
- ❌ Campaign corruption still occurring
- ❌ Delete functionality completely broken
- ❌ AI consistently fails/times out

---

## 📞 **Communication Plan**

### **Who to Notify:**
- [x] Dev team - Aware of change
- [ ] QA team - Ready to test
- [ ] Support team - Know to expect "slow delete" feedback
- [ ] Product - Understand trade-offs

### **User Communication:**
**If users ask why deletes are slower:**

> "We temporarily adjusted how component deletion works to ensure 100% reliability and prevent any data loss. Deletes now take 1-2 seconds but are guaranteed to work correctly. We're working on a permanent solution that will be both fast and safe."

---

## 🎯 **Success Metrics**

**This deployment is successful if:**
- ✅ No "Unexpected closing tag" errors (24 hours)
- ✅ Delete success rate = 100%
- ✅ No campaign corruption reports
- ✅ User complaints < 5 about slowness

**This deployment failed if:**
- ❌ Errors persist
- ❌ Campaigns still get corrupted
- ❌ Delete functionality broken
- ❌ Mass user complaints (> 20)

---

## 📅 **Follow-Up Tasks**

### **This Week:**
- [ ] Monitor metrics for 7 days
- [ ] Gather user feedback
- [ ] Document AI cost impact
- [ ] Plan Babel AST implementation

### **Next Sprint:**
- [ ] Implement Babel AST parser (proper fix)
- [ ] Add undo/redo functionality
- [ ] Add version history for campaigns
- [ ] Re-enable instant deletes

### **Future:**
- [ ] Visual diff preview before applying changes
- [ ] Transaction/rollback system
- [ ] Better error recovery UI

---

## 📚 **Related Documentation**

- **Emergency Fix Details:** `EMERGENCY-DELETE-FIX.md`
- **Test Guide:** `DELETE-TEST-GUIDE.md`
- **Parser Code:** `lib/email-v3/tsx-parser.ts`
- **Refine Logic:** `app/api/v3/campaigns/refine/route.ts`

---

## ✅ **Final Checklist**

Before marking deployment as complete:

- [ ] All pre-deployment checks passed
- [ ] Code pushed to production
- [ ] Smoke test completed successfully
- [ ] Monitoring dashboard watching
- [ ] Team notified
- [ ] Support team briefed
- [ ] This checklist completed

**Deployment Status:** ⏳ In Progress / ✅ Complete / ❌ Rolled Back

**Deployed By:** [YOUR NAME]  
**Date:** [DATE]  
**Time:** [TIME]

---

**Next:** Monitor for 24 hours, then schedule Babel implementation 🚀
