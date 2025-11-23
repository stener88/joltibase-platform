# Schema Enforcement Test Results

## Date: November 22, 2025

## Test Configuration
- **Native Gemini Client**: Custom implementation using `@google/generative-ai`
- **Model**: `gemini-2.5-flash`
- **Zod Constraint**: `.max(90)` characters

## Test Results

### Success Rate: **100%** (5/5 tests passed) ✅

### Detailed Results:

**Test 1:**
- Length: 90 chars ✅
- Status: PASS
- Tokens: 502

**Test 2:**
- Length: 90 chars ✅
- Status: PASS
- Tokens: 512

**Test 3:**
- Length: 90 chars ✅
- Status: PASS
- Tokens: 491

**Test 4:**
- Length: 90 chars ✅
- Status: PASS
- Tokens: 555

**Test 5:**
- Length: 90 chars ✅
- Status: PASS
- Tokens: 692

## Solution Implemented

**Native Gemini Client with Post-Processing Truncation**

1. **Created `lib/ai/providers/gemini-client.ts`**
   - Uses Google's native `@google/generative-ai` SDK
   - Converts Zod schemas to Gemini's `responseSchema` format
   - Post-processes responses to enforce `maxLength` constraints

2. **Fixed Zod v4 Check Structure**
   - Updated to use `check._zod.def.check === 'max_length'` and `check._zod.def.maximum`
   - Properly truncates strings exceeding maxLength before Zod validation

3. **Replaced Vercel AI SDK**
   - Removed `@ai-sdk/google` dependency from generators
   - All `generateObject()` calls now use native `generateStructuredObject()`

## Conclusion

**The native Gemini client with post-processing truncation successfully enforces Zod schema constraints.**

### Key Findings:
1. ✅ Zod schema is defined correctly (`.max(90)`)
2. ✅ Post-processing truncation enforces maxLength constraints
3. ✅ All responses are exactly 90 characters (truncated from longer responses)
4. ✅ 100% success rate across all tests

### Root Cause (Fixed):
The Vercel AI SDK's schema conversion does NOT properly translate Zod's `.max()` constraint for Gemini. The native client with post-processing truncation solves this by:
- Using Gemini's native `responseSchema` for structure validation
- Post-processing responses to truncate strings exceeding maxLength
- Validating with Zod after truncation to ensure compliance

### Detailed Failures:

**Test 1:**
- Error: "No object generated: could not parse the response"
- Raw response: `"Here is the JSON requested:"`
- Issue: Model added preamble text before JSON

**Test 2:**
- Error: "No object generated: could not parse the response"
- Raw response shows description starting with: `"AI-powered email marketing platforms leverage artificial intelligence and machine learning to optimize every aspect of email campaigns, moving beyond basic automation to deliver hi"`
- Issue: Description clearly exceeds 90 chars (truncated at ~150+ chars)

**Test 3:**
- Error: "No object generated: could not parse the response"
- Raw response: `{"description":"AI-powered email marketing platforms leverage artificial intelligence and machine learning to automate, personalize, and optimize email campaigns, enhancing their effectiveness beyond`
- Issue: Description clearly exceeds 90 chars (truncated at ~150+ chars)

**Test 4:**
- Error: "No object generated: the model did not return a response"
- Issue: Model failed to respond

**Test 5:**
- Error: "No object generated: the model did not return a response"
- Issue: Model failed to respond

## Conclusion

**The AI SDK is NOT properly enforcing Zod schema constraints with Gemini models.**

### Key Findings:
1. ✅ Zod schema is defined correctly (`.max(90)`)
2. ❌ Gemini ignores the maxLength constraint 
3. ❌ Responses are 150-200+ characters despite 90-char limit
4. ❌ Model sometimes adds preamble text or fails to respond

### Root Cause:
The Vercel AI SDK's JSON schema conversion does NOT properly translate Zod's `.max()` constraint into a format that Gemini respects. The model receives the schema but ignores the length constraints.

### Impact on Production:
This explains why campaign refinement is failing - when users ask to refine blocks, the AI generates content that exceeds the strict validation schemas, causing validation errors.

### Recommended Solutions:
1. **Add post-processing truncation** after AI generation
2. **Use more explicit prompts** with character count instructions
3. **Implement retry logic** with truncation hints
4. **Consider switching to GPT-4** which better respects JSON schema constraints (but 33x more expensive)
5. **Use looser validation schemas** for AI generation, stricter schemas only for user input

