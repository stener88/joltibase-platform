# Validation Fixes Applied

## Date: November 22, 2025

## Issues Fixed

### 1. **Null Values for Optional Fields** ✅
- **Problem**: Gemini returns `null` instead of `undefined` for optional fields
- **Solution**: Added `sanitizeGeneratedContent()` function that removes null values before validation

### 2. **Invalid Enum Values** ✅
- **Problem**: Gemini generates invalid icon names not in the enum (e.g., "moon", "sun", "eye")
- **Solution**: Icon mapping fallback with 20+ common invalid icons mapped to valid ones

### 3. **Enum Schema Enforcement** ✅
- **Problem**: Gemini's responseSchema doesn't strongly enforce enum constraints
- **Solution**: Enhanced `zodToGeminiSchema` to add explicit enum descriptions

### 4. **Better Prompting** ✅
- **Problem**: AI not aware of valid icon options
- **Solution**: Added detailed ICON SELECTION section to system prompt with examples

## Changes Made

### 1. `lib/ai/providers/gemini-client.ts`
Added `sanitizeGeneratedContent()` function:
- Removes `null` values (lets Zod use defaults or optionals)
- Maps invalid icon names to valid ones:
  - `moon/sun` → `star`
  - `eye/security/safe` → `shield`
  - `dark/light/speed/fast` → `lightning`
  - `checkmark/tick` → `check`
  - And 10+ more mappings

### 2. `lib/ai/providers/zod-to-gemini-schema.ts`
Enhanced enum handling:
```typescript
{
  type: SchemaType.STRING,
  enum: enumValues,
  description: `Must be EXACTLY one of: ${enumValues.join(', ')}. Do not invent new values.`
}
```

### 3. `lib/email-v2/ai/prompts-v2.ts`
Added comprehensive icon guidance:
- Lists all 8 valid icons with descriptions
- Explicit "DO NOT invent icon names" warning
- Clarified imageUrl should be omitted (fetched separately)

## Processing Pipeline

```
Gemini Response
    ↓
1. JSON Parsing (with cleanup)
    ↓
2. sanitizeGeneratedContent() - Fix nulls & invalid enums
    ↓
3. enforceStringLengthConstraints() - Truncate long strings
    ↓
4. Zod Validation - Final schema check
    ↓
Validated Object
```

## Expected Results

- **Hero blocks**: Should generate successfully (imageUrl handled as optional)
- **Features blocks**: Icons will be valid or auto-corrected to fallback
- **All blocks**: Null values won't cause validation failures

## Next Test

Run a campaign generation to verify all blocks generate successfully without validation errors.


