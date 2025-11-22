# Unused Code Audit Report
Generated: 2025-01-21

## Summary
This document identifies unused code that can be safely removed from the codebase.

## Phase 1: Critical Errors Fixed ✅

### Error 1: Missing Template Mapping
- **Status**: Already fixed - `list/numbered` variant mapped to `simple-list` template in `template-registry.ts:169`

### Error 2: CTA Background Color Schema Issue  
- **Status**: Fixed ✅
- **Changes**:
  - Removed `backgroundColor` references from CTA prompt (`prompts-v2.ts:40`)
  - Removed `backgroundColor` from example JSON (`prompts-v2.ts:259`)
  - Removed `backgroundColor` handling from `color-enforcer.ts`
  - Updated component edit patterns to remove backgroundColor references

### Error 3: Template Selectors
- **Status**: Partially fixed ✅ Removed debug logging from template engine
- **Remaining**: Selectors still need testing - `a[href]` should work for header menu items

## Phase 2: Unused Code Identified

### ✅ DEFINITELY UNUSED (Safe to Delete)

#### 1. React Pattern Components (16 files)
**Location**: `lib/email-v2/patterns/`
**Reason**: Replaced by HTML templates
**Files**:
- `ArticlePattern.tsx`
- `ContentPattern.tsx`
- `CtaPattern.tsx`
- `EcommercePattern.tsx`
- `FeaturesPattern.tsx`
- `FeedbackPattern.tsx`
- `FooterPattern.tsx`
- `GalleryPattern.tsx`
- `HeaderPattern.tsx`
- `HeroPattern.tsx`
- `ListPattern.tsx`
- `MarketingPattern.tsx`
- `PricingPattern.tsx`
- `StatsPattern.tsx`
- `TestimonialPattern.tsx`
- `utils.tsx`

**Verification**: No imports found (`grep -r "email-v2/patterns"` returned empty)

#### 2. Old V1 Prompts
**Location**: `lib/ai/prompts.ts` (593 lines)
**Reason**: Replaced by `lib/email-v2/ai/prompts-v2.ts`
**Verification**: No imports found (`grep -r "lib/ai/prompts"` returned empty)

#### 3. Old V1 Generator
**Location**: `lib/ai/generator.ts`
**Reason**: Replaced by `lib/email-v2/ai/generator-v2.ts` and `generator-two-pass.ts`
**Verification**: No imports found (`grep -r "lib/ai/generator\""` returned empty)

### ⚠️ POTENTIALLY UNUSED (Needs Testing)

#### 1. Old V1 Email System
**Location**: `lib/email/` directory
**Files to check**:
- `lib/email/blocks/renderers/` - Old V1 renderers
- `lib/email/blocks/registry/` - Old V1 block registry
- `lib/email/blocks/configs/` - Old V1 block configs
- `lib/email/composition/` - Composition engine (may still be used)
- `lib/email/client.ts` - Email client (may still be used)
- `lib/email/sender.ts` - Email sender (may still be used)
- `lib/email/queue.ts` - Email queue (may still be used)

**Action**: Check if V1 email system is still used for non-V2 campaigns

#### 2. Old V1 Validator
**Location**: `lib/ai/validator.ts`
**Reason**: May be used by V1 system
**Action**: Check if V1 email generation still uses this

#### 3. Test Scripts
**Location**: `scripts/`
**Files**:
- `generate-composition-examples.js`
- `test-email-v2.ts`

**Action**: Check if these are used in CI/CD or development workflow

### ✅ STILL IN USE (Keep)

#### 1. Rate Limiting
**Location**: `lib/ai/rate-limit.ts`
**Status**: ✅ Used in `app/api/ai/generate-campaign/route.ts`

#### 2. Usage Tracker
**Location**: `lib/ai/usage-tracker.ts`
**Status**: ✅ Likely used for tracking AI usage

#### 3. AI Client & Providers
**Location**: `lib/ai/client.ts`, `lib/ai/providers/`
**Status**: ✅ Likely used by V2 system

## Recommendations

### Immediate Actions (Safe to Delete)
1. **Delete React Pattern Components** (`lib/email-v2/patterns/` directory)
   - 16 files, ~2000+ lines
   - Replaced by HTML templates

2. **Delete Old V1 Prompts** (`lib/ai/prompts.ts`)
   - 593 lines
   - Replaced by `prompts-v2.ts`

3. **Delete Old V1 Generator** (`lib/ai/generator.ts`)
   - Replaced by V2 generators

### Further Investigation Needed
1. **V1 Email System** (`lib/email/`)
   - Check if still used for legacy campaigns
   - If not, entire directory can be removed (~5000+ lines)

2. **Test Scripts** (`scripts/`)
   - Verify if used in development/CI
   - If not, can be removed

## Estimated Cleanup Impact

**Definitely Unused**:
- ~3000+ lines of code
- 18 files

**Potentially Unused**:
- ~5000+ lines (if V1 system is unused)
- ~50+ files

**Total Potential Cleanup**: ~8000+ lines, ~70+ files

## Next Steps

1. ✅ Fix critical errors (completed)
2. ⏳ Test email generation to verify selector fixes work
3. ⏳ Delete definitely unused files
4. ⏳ Investigate V1 system usage
5. ⏳ Create PR with cleanup

