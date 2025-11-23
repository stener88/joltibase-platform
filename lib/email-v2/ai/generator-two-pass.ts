/**
 * Two-Pass Email Generation System
 * 
 * Solves Gemini's "too many states" error by splitting complexity:
 * - Pass 1: Generate structure (block types + order)
 * - Pass 2: Generate content for each block individually
 */

import { z } from 'zod';
import { generateStructuredObject } from '@/lib/ai/client';
import { BLOCK_CONTENT_SCHEMAS } from './block-schemas';
import type { GlobalEmailSettings } from '../types';
import type { SemanticBlock } from './blocks';
import { getMaxBlocksForCampaign } from './blocks';
import { SEMANTIC_GENERATION_SYSTEM_PROMPT, STRUCTURE_GENERATION_SYSTEM_PROMPT, getBlockVariantGuidance } from './prompts-v2';
import { preprocessPrompt, type PreprocessedPrompt } from './prompt-intelligence';

// ==========================================
// PASS 1 SCHEMAS (Simple)
// ==========================================

/**
 * Block structure - just type and purpose
 * Only includes block types that have corresponding templates
 */
const BlockStructureSchema = z.object({
  blockType: z.enum([
    'hero',
    'features',
    'testimonial',
    'gallery',
    'stats',
    'pricing',
    'article',
    'articles',
    'list',
    'ecommerce',
    'marketing',
    'header',
    'feedback',
    'heading',
    'text',
    'link',
    'buttons',
    'image',
    'avatars',
    'code',
    'markdown',
    'cta',
    'footer',
  ]),
  purpose: z.string().max(150), // Increased to allow more descriptive purposes
});

/**
 * Email structure - just the skeleton
 */
const EmailStructureSchema = z.object({
  previewText: z.string().min(1).max(140),
  blocks: z.array(BlockStructureSchema).min(2).max(12),
});

type EmailStructure = z.infer<typeof EmailStructureSchema>;
type BlockStructure = z.infer<typeof BlockStructureSchema>;

// ==========================================
// TYPES
// ==========================================

interface GenerationSettings {
  companyName?: string;
  audience?: string;
  tone?: string;
  contentType?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export interface EmailContent {
  previewText: string;
  blocks: SemanticBlock[];
  usage?: any; // Token usage data
}

// ==========================================
// PASS 1: STRUCTURE GENERATION
// ==========================================

async function generateEmailStructure(
  prompt: string,
  settings: GenerationSettings,
  emailType: string,
  maxBlocks: number,
  modelName: string,
  preprocessed?: PreprocessedPrompt
): Promise<{ structure: EmailStructure; usage: any }> {
  console.log('🏗️  [PASS-1] Generating email structure...');
  
  // Optimized: Concise structure prompt to reduce input tokens
  const structureUserPrompt = `Generate email structure for: "${prompt}"

Context: ${emailType} email, max ${maxBlocks} blocks
${settings.companyName ? `Company: ${settings.companyName}` : ''}
${settings.tone ? `Tone: ${settings.tone}` : ''}
${preprocessed?.structureHints?.gridLayout ? `Grid: ${preprocessed.structureHints.gridLayout.columns}×${preprocessed.structureHints.gridLayout.rows} (${preprocessed.structureHints.itemCount} items)` : ''}
${preprocessed?.structureHints?.needsLogo ? 'Include header with logo' : ''}

Choose block types, order logically (header→content→cta). MAX ${maxBlocks} blocks total. Prioritize VISUAL blocks (gallery, stats, features with images, ecommerce) over text-heavy blocks. Each block needs purpose field:
- blockType: one from the list below
- purpose: Brief description (STRICT: max 150 chars)

Footer auto-added. previewText ≤140 chars.

Block types: header, hero, heading, text, features, testimonial, gallery, stats, pricing, ecommerce, article, articles, list, marketing, feedback, buttons, image, avatars, link, code, markdown, cta`.trim();

  let object: z.infer<typeof EmailStructureSchema>;
  let usage: any;
  
  try {
    const result = await generateStructuredObject({
      model: modelName,
      schema: EmailStructureSchema,
      system: STRUCTURE_GENERATION_SYSTEM_PROMPT, // Minimal prompt for structure only
      prompt: structureUserPrompt,
      maxOutputTokens: 2000, // Increased for very complex prompts with many constraints
    });
    object = result.object;
    usage = result.usage;
  } catch (error: any) {
    // Handle previewText validation errors by extracting and truncating
    console.error('[PASS-1] Generation error caught:', {
      errorType: error?.constructor?.name,
      message: error?.message,
      hasCause: !!error?.cause,
      causeType: error?.cause?.constructor?.name,
      causeIssues: error?.cause?.issues,
      errorValue: error?.value,
      causeValue: error?.cause?.value,
    });
    
    // Extract Zod validation issues - they can be nested deep in the error chain
    const zodError = error?.cause?.cause || error?.cause || error;
    const issues = zodError?.issues || error?.cause?.issues || error?.issues || [];
    
    const isPreviewTextError = issues.some((issue: any) => 
      (Array.isArray(issue.path) ? issue.path.includes('previewText') : issue.path?.includes?.('previewText')) && 
      issue.code === 'too_big'
    );
    
    // Check for purpose field validation errors
    const isPurposeError = issues.some((issue: any) => {
      const pathStr = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || '');
      return pathStr.includes('purpose') && issue.code === 'too_big';
    });
    
    console.log('[PASS-1] Error analysis:', {
      hasIssues: issues.length > 0,
      issueCount: issues.length,
      isPreviewTextError,
      isPurposeError,
      issues: issues.map((i: any) => ({ path: i.path, code: i.code }))
    });
    
    // Check for length errors (response cut off due to token limit)
    const isLengthError = error?.finishReason === 'length' || 
                          error?.cause?.finishReason === 'length' ||
                          (error?.response && error?.response?.finishReason === 'length');
    
    // Check for JSON parse errors (unterminated string, etc.)
    const isJsonParseError = error?.message?.includes('Unterminated string') || 
                             error?.message?.includes('JSON parsing failed') ||
                             error?.message?.includes('No object generated') ||
                             error?.cause?.message?.includes('Unterminated string') ||
                             error?.cause?.message?.includes('JSON parsing failed');
    
    if (isLengthError || isJsonParseError) {
      const errorType = isLengthError ? 'token limit exceeded' : 'JSON parse error';
      console.warn(`[PASS-1] ${errorType} detected, retrying with stricter constraints (same token limit)...`);
      
      // Retry with explicit instruction to keep responses VERY concise - same token limit
      const retryPrompt = `CRITICAL: purpose fields must be ≤100 characters (reduced from 150). Keep ALL responses extremely concise. Generate fewer blocks (max ${maxBlocks - 1}). Use short purposes only.

${structureUserPrompt}`;
      
      try {
        const retryResult = await generateStructuredObject({
          model: modelName,
          schema: EmailStructureSchema,
          system: STRUCTURE_GENERATION_SYSTEM_PROMPT,
          prompt: retryPrompt,
          maxOutputTokens: 2000, // Same as original: increased for complex structure
        });
        object = retryResult.object;
        usage = retryResult.usage;
        console.log('[PASS-1] Successfully recovered with stricter constraints');
      } catch (retryError: any) {
        console.error('[PASS-1] Retry failed - token limit is strict, cannot increase');
        throw error; // Throw original error - limit is enforced
      }
    } else if (isPurposeError) {
      console.warn(`[PASS-1] Purpose field(s) too long, retrying with explicit length constraint...`);
      
      // Extract which purposes are too long
      const tooLongPurposes = issues
        .filter((issue: any) => {
          const pathStr = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || '');
          return pathStr.includes('purpose') && issue.code === 'too_big';
        })
        .map((issue: any) => {
          const pathStr = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || '');
          return { path: pathStr, max: issue.maximum };
        });
      
      console.warn('[PASS-1] Purpose errors:', tooLongPurposes);
      
      // Retry with stricter purpose constraint
      const retryPrompt = `CRITICAL: ALL purpose fields MUST be ≤100 characters. COUNT CHARACTERS BEFORE WRITING. Use brief, direct purposes only.

${structureUserPrompt}`;
      
      try {
        const retryResult = await generateStructuredObject({
          model: modelName,
          schema: EmailStructureSchema,
          system: STRUCTURE_GENERATION_SYSTEM_PROMPT + '\n\nCRITICAL: purpose fields must be ≤100 characters. Count before writing.',
          prompt: retryPrompt,
          maxOutputTokens: 2000,
        });
        object = retryResult.object;
        usage = retryResult.usage;
        console.log('[PASS-1] Successfully recovered with purpose length constraint');
      } catch (retryError: any) {
        console.error('[PASS-1] Retry failed for purpose length');
        throw error; // Throw original error
      }
    } else if (isPreviewTextError) {
      console.warn(`[PASS-1] Preview text validation failed, attempting to extract and fix...`);
      
      // Try to extract the previewText from various error locations
      const errorValue = zodError?.value || error?.value || error?.data;
      
      console.log('[PASS-1] Extracted error value:', {
        hasPreviewText: !!errorValue?.previewText,
        previewTextLength: errorValue?.previewText?.length,
        hasBlocks: Array.isArray(errorValue?.blocks),
        blocksLength: errorValue?.blocks?.length,
      });
      
      if (errorValue?.previewText && Array.isArray(errorValue.blocks)) {
        const truncatedPreview = errorValue.previewText.substring(0, 137) + '...';
        console.warn(`[PASS-1] Truncated previewText from ${errorValue.previewText.length} to ${truncatedPreview.length} chars`);
        
        // Use the truncated version directly (blocks are valid, only previewText was too long)
        object = {
          previewText: truncatedPreview,
          blocks: errorValue.blocks,
        };
        // Estimate usage (we can't know exact tokens, but this is better than 0)
        usage = { promptTokens: 0, completionTokens: 0 };
        
        console.log('[PASS-1] Successfully recovered from previewText error');
      } else {
        // If we can't extract, throw original error
        console.error('[PASS-1] Could not extract valid data from error, rethrowing');
        throw error;
      }
    } else if (isPurposeError) {
      console.warn(`[PASS-1] Purpose field validation failed (${issues.filter((i: any) => i.path?.includes?.('purpose')).length} fields), attempting to extract and fix...`);
      
      // Try to extract the blocks from error - check multiple possible locations
      const errorValue = error?.value || error?.cause?.value || zodError?.value || error?.data || {};
      
      console.log('[PASS-1] Extracting error value:', {
        hasValue: !!error?.value,
        hasCauseValue: !!error?.cause?.value,
        hasZodValue: !!zodError?.value,
        hasBlocks: !!errorValue?.blocks,
        blocksLength: errorValue?.blocks?.length
      });
      
      if (errorValue?.blocks && Array.isArray(errorValue.blocks)) {
        // Truncate purpose fields that exceed limit
        const fixedBlocks = errorValue.blocks.map((block: any, index: number) => {
          if (block.purpose && block.purpose.length > 150) {
            console.warn(`[PASS-1] Block ${index}: Truncating purpose field from ${block.purpose.length} to 150 chars`);
            console.warn(`[PASS-1] Original purpose: "${block.purpose.substring(0, 200)}..."`);
            return {
              ...block,
              purpose: block.purpose.substring(0, 147) + '...'
            };
          }
          return block;
        });
        
        object = {
          previewText: errorValue.previewText || 'Welcome! Discover our features and get started today.',
          blocks: fixedBlocks,
        };
        // Estimate usage
        usage = { promptTokens: 0, completionTokens: 0 };
        
        console.log('[PASS-1] Successfully recovered from purpose field error');
      } else {
        console.error('[PASS-1] Could not extract valid blocks from error. Error structure:', {
          errorKeys: Object.keys(error),
          causeKeys: error?.cause ? Object.keys(error.cause) : [],
          hasValue: !!error?.value,
          valueKeys: error?.value ? Object.keys(error.value) : []
        });
        throw error;
      }
    } else {
      // Log unhandled error for debugging
      console.error('[PASS-1] Unhandled error type:', {
        errorType: error?.constructor?.name,
        message: error?.message,
        issues: issues.map((i: any) => ({ path: i.path, code: i.code, message: i.message }))
      });
      throw error;
    }
  }

  // Final safety check: truncate previewText if it still exceeds limit
  if (object.previewText.length > 140) {
    console.warn(`[PASS-1] Preview text exceeded limit (${object.previewText.length} chars), truncating to 140`);
    object.previewText = object.previewText.substring(0, 137) + '...';
  }

  // Safety check: truncate purpose fields if they exceed limit
  for (const block of object.blocks) {
    if (block.purpose && block.purpose.length > 150) {
      console.warn(`[PASS-1] Purpose field exceeded limit (${block.purpose.length} chars), truncating to 150`);
      block.purpose = block.purpose.substring(0, 147) + '...';
    }
  }

  // Log token usage
  const totalTokens = (usage?.promptTokens || 0) + (usage?.completionTokens || 0);
  console.log(`💰 [PASS-1] Token usage: ${totalTokens} (prompt: ${usage?.promptTokens || 0}, completion: ${usage?.completionTokens || 0})`);

  console.log(`✅ [PASS-1] Generated ${object.blocks.length} blocks`);
  return { structure: object, usage };
}

// ==========================================
// BLOCK-SPECIFIC REQUIREMENTS
// ==========================================

/**
 * Get explicit field requirements for each block type - ULTRA-COMPACT
 */
function getBlockSpecificRequirements(blockType: string): string {
  const r: Record<string, string> = {
    hero: `headline≤80,subheadline≤140,ctaText≤30,ctaUrl(valid),imageKeyword≤60`,
    features: `heading≤80,subheading≤140,features[3-4]:{title≤40,description≤90,imageKeyword≤60}`,
    list: `heading≤80,items[4+]:{title≤40,description≤90}`,
    cta: `headline≤80,subheadline≤140,buttonText≤30,buttonUrl(valid)`,
    heading: `text≤80`,
    text: `content:concise`,
    footer: `companyName,unsubscribeUrl(valid)`,
    testimonial: `quote≤120,authorName≤40,authorTitle≤40,imageKeyword≤60`,
    article: `heading≤80,excerpt≤80,imageKeyword≤60`,
    articles: `heading≤80,articles[2-4]:{heading≤80,excerpt≤100,imageKeyword≤60}`,
    ecommerce: `heading≤80,products[1-4]:{name≤40,description≤90,price,imageKeyword≤60}`,
    gallery: `heading≤80,images[2-6]:imageKeyword≤60`,
    stats: `heading≤80,stats[2-4]:{value≤40,label≤40,description≤80}`,
    pricing: `heading≤80,plans[1-3]:{name≤40,price,description≤120,features[3-5]≤50}`,
    marketing: `heading≤80,featuredItem:{title≤40,description≤90,imageKeyword≤60},items[2-4]:{title≤40,description≤90,imageKeyword≤60}. DO NOT generate imageUrl.`,
    feedback: `heading≤80,subheading≤140,ctaText≤30,ctaUrl(valid)`,
  };

  return r[blockType] || `All fields.Check schema.`;
}

// ==========================================
// PASS 2: BLOCK CONTENT GENERATION
// ==========================================

async function generateBlockContent(
  blockStructure: BlockStructure,
  emailContext: {
    prompt: string;
    previewText: string;
    settings: GenerationSettings;
    previousBlocks: any[];
  },
  modelName: string
): Promise<{ block: SemanticBlock; usage: any } | null> {
  const schema = BLOCK_CONTENT_SCHEMAS[blockStructure.blockType];
  
  if (!schema) {
    console.warn(`⚠️  [PASS-2] No schema for ${blockStructure.blockType}, skipping`);
    return null;
  }

  console.log(`📝 [PASS-2] Generating ${blockStructure.blockType} content...`);

  // Phase 4: Dynamic variant guidance - only include relevant block's variants
  const variantGuidance = getBlockVariantGuidance(blockStructure.blockType);

  // Generate block-specific prompt with explicit field requirements
  const blockSpecificRequirements = getBlockSpecificRequirements(blockStructure.blockType);
  
  // Keep prompt minimal - no extra context to maximize output token budget
  const blockUserPrompt = `${blockStructure.blockType}. ${blockSpecificRequirements}${variantGuidance ? ` ${variantGuidance}` : ''}

Purpose: ${blockStructure.purpose}${emailContext.settings.companyName ? ` Co:${emailContext.settings.companyName}` : ''}${emailContext.settings.tone ? ` Tone:${emailContext.settings.tone}` : ''}`.trim();

  try {
    const result = await generateStructuredObject({
      model: modelName,
      schema,
      system: SEMANTIC_GENERATION_SYSTEM_PROMPT,
      prompt: blockUserPrompt,
      maxOutputTokens: 2000,
    });
    const { object, usage } = result;

    console.log(`✅ [PASS-2] ${blockStructure.blockType} generated successfully`);
    
    // Log actual generated content for debugging
    const contentPreview: Record<string, any> = {};
    if (blockStructure.blockType === 'hero') {
      contentPreview.headline = (object as any).headline?.substring(0, 100);
      contentPreview.subheadline = (object as any).subheadline?.substring(0, 100);
      contentPreview.ctaText = (object as any).ctaText;
      contentPreview.hasImageKeyword = !!(object as any).imageKeyword;
    } else if (blockStructure.blockType === 'features') {
      contentPreview.heading = (object as any).heading?.substring(0, 100);
      contentPreview.subheading = (object as any).subheading?.substring(0, 100);
      contentPreview.featureCount = (object as any).features?.length || 0;
      contentPreview.firstFeatureTitle = (object as any).features?.[0]?.title?.substring(0, 50);
      contentPreview.firstFeatureDesc = (object as any).features?.[0]?.description?.substring(0, 80);
    } else if (blockStructure.blockType === 'list') {
      contentPreview.heading = (object as any).heading?.substring(0, 100);
      contentPreview.itemCount = (object as any).items?.length || 0;
      contentPreview.firstItemTitle = (object as any).items?.[0]?.title?.substring(0, 50);
      contentPreview.firstItemDesc = (object as any).items?.[0]?.description?.substring(0, 80);
    } else if (blockStructure.blockType === 'cta') {
      contentPreview.headline = (object as any).headline?.substring(0, 100);
      contentPreview.subheadline = (object as any).subheadline?.substring(0, 100);
      contentPreview.buttonText = (object as any).buttonText;
    }
    console.log(`📄 [PASS-2] ${blockStructure.blockType} content preview:`, JSON.stringify(contentPreview, null, 2));

    return {
      block: {
        blockType: blockStructure.blockType,
        ...(object as Record<string, any>),
      } as SemanticBlock,
      usage,
    };
  } catch (error: any) {
    // Log error details for debugging
    console.log(`[PASS-2] Generation error caught for ${blockStructure.blockType}:`, {
      errorType: error?.constructor?.name,
      message: error?.message,
      hasCause: !!error?.cause,
      causeType: error?.cause?.constructor?.name,
    });
    
    // Extract Zod validation issues for detailed error reporting
    const zodError = error?.cause?.cause || error?.cause || error;
    const issues = zodError?.issues || error?.cause?.issues || error?.issues || [];
    
    if (issues.length > 0) {
      const tooLongFields = issues
        .filter((issue: any) => issue.code === 'too_big')
        .map((issue: any) => {
          const path = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || '');
          return { path, max: issue.maximum };
        });
      
      if (tooLongFields.length > 0) {
        console.warn(`⚠️  [PASS-2] Schema validation failed for ${blockStructure.blockType}:`, tooLongFields);
        console.warn(`💡 [PASS-2] Check that prompt uses correct field names and limits match schema`);
      }
    }
    
    // Fail fast - rely on clear initial prompt instead of retrying
    console.error(`❌ [PASS-2] Failed to generate ${blockStructure.blockType}:`, error);
    return null;
  }
}

// ==========================================
// MAIN TWO-PASS ORCHESTRATOR
// ==========================================

export async function generateSemanticBlocks(
  prompt: string,
  settings: GlobalEmailSettings,
  emailType: string,
  options: {
    maxBlocks?: number;
    itemCount?: number;
    gridLayout?: { columns: number; rows: number };
  } = {},
  model: string = 'gemini-2.5-flash'
): Promise<EmailContent> {
  console.log('🚀 [TWO-PASS-GEN] Starting two-pass generation');
  console.log(`📝 [TWO-PASS-GEN] Prompt: "${prompt}"`);

  const startTime = Date.now();

  // Preprocess prompt to extract intent
  console.log('🔍 [TWO-PASS-GEN] Preprocessing prompt...');
  const preprocessed = preprocessPrompt(prompt, { campaignType: emailType });

  console.log('📊 [TWO-PASS-GEN] Detected:', {
    emailType: preprocessed.emailType,
    tone: preprocessed.tone,
    contentType: preprocessed.contentType,
    features: preprocessed.detectedFeatures,
  });

  // Merge detected preferences with user settings (user settings take precedence)
  const enhancedSettings: GenerationSettings = {
    companyName: (settings as any).companyName,
    audience: (settings as any).audience,
    tone: (settings as any).tone || preprocessed.tone,
    contentType: preprocessed.contentType,
    primaryColor: settings.primaryColor || preprocessed.colorPreferences?.primaryColor,
    secondaryColor: (settings as any).secondaryColor,
    backgroundColor: settings.backgroundColor || preprocessed.colorPreferences?.backgroundColor,
    fontFamily: settings.fontFamily || preprocessed.fontPreferences?.fontFamily,
  };

  // Merge structure hints (preprocessed takes precedence if more specific)
  const mergedStructureHints = {
    gridLayout: options.gridLayout || preprocessed.structureHints?.gridLayout,
    itemCount: options.itemCount || preprocessed.structureHints?.itemCount,
    needsTable: preprocessed.structureHints?.needsTable,
    needsLogo: preprocessed.structureHints?.needsLogo,
  };

  // Determine max blocks (use detected suggestion if available)
  const detectedMaxBlocks = preprocessed.suggestedMaxBlocks;
  // Aggressive block limits to reduce token usage
  const baseMaxBlocks = getMaxBlocksForCampaign(
    undefined,
    prompt,
    { itemCount: mergedStructureHints.itemCount, gridLayout: mergedStructureHints.gridLayout }
  );
  
  const maxBlocks = options.maxBlocks || Math.min(
    detectedMaxBlocks || baseMaxBlocks,
    emailType === 'transactional' ? 4 : 6  // Fewer blocks = fewer tokens
  );

  console.log(`📦 [TWO-PASS-GEN] Max blocks: ${maxBlocks} (emailType: ${emailType || 'general'})`);

  // Use enhanced prompt with detected metadata
  const enhancedPrompt = preprocessed.enhancedPrompt;

  try {
    // PASS 1: Generate structure
    const { structure, usage: structureUsage } = await generateEmailStructure(
      enhancedPrompt,
      enhancedSettings,
      preprocessed.emailType,
      maxBlocks,
      model,
      preprocessed
    );

    // PASS 2: Generate blocks in batches (reduces concurrent API calls)
    const BATCH_SIZE = 2; // Process 2 blocks at a time instead of all parallel
    console.log(`📝 [PASS-2] Generating blocks in batches of ${BATCH_SIZE}...`);
    
    const generatedBlocks: SemanticBlock[] = [];
    const blockUsages: any[] = [];
    
    // Process blocks in batches
    for (let i = 0; i < structure.blocks.length; i += BATCH_SIZE) {
      const batch = structure.blocks.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(structure.blocks.length / BATCH_SIZE);
      
      console.log(`📦 [PASS-2] Batch ${batchNumber}/${totalBatches}: Processing ${batch.map(b => b.blockType).join(', ')}`);
      
      // Generate batch in parallel
      const batchPromises = batch.map((blockStructure, batchIdx) => {
        const globalIdx = i + batchIdx;
        console.log(`📝 [PASS-2] Generating ${blockStructure.blockType} content (${globalIdx + 1}/${structure.blocks.length})...`);
        return generateBlockContent(
          blockStructure,
          {
            prompt: enhancedPrompt,
            previewText: structure.previewText,
            settings: enhancedSettings,
            previousBlocks: generatedBlocks, // Include context from previously generated blocks
          },
          model
        );
      });

      const batchResults = await Promise.all(batchPromises);
      
      // Extract results from this batch
      batchResults.forEach(result => {
        if (result) {
          generatedBlocks.push(result.block);
          blockUsages.push(result.usage);
        }
      });
    }

    // Ensure footer is always included (legal requirement)
    const hasFooter = generatedBlocks.some(b => b.blockType === 'footer');
    if (!hasFooter) {
      console.log('📝 [TWO-PASS-GEN] Adding footer block (required for legal compliance)');
      generatedBlocks.push({
        blockType: 'footer',
        variant: 'simple',
        companyName: enhancedSettings.companyName || 'Company',
        unsubscribeUrl: 'https://example.com/unsubscribe',
      } as SemanticBlock);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ [TWO-PASS-GEN] Complete in ${duration}ms`);
    console.log(`📊 [TWO-PASS-GEN] Generated ${generatedBlocks.length} blocks (including auto-added footer)`);

    // Aggregate usage data
    const totalUsage = {
      promptTokens: (structureUsage?.promptTokens || 0) + blockUsages.reduce((sum, u) => sum + (u?.promptTokens || 0), 0),
      completionTokens: (structureUsage?.completionTokens || 0) + blockUsages.reduce((sum, u) => sum + (u?.completionTokens || 0), 0),
      totalTokens: (structureUsage?.totalTokens || 0) + blockUsages.reduce((sum, u) => sum + (u?.totalTokens || 0), 0),
    };
    
    console.log(`💰 [TWO-PASS-GEN] Tokens: ${totalUsage.totalTokens} (prompt: ${totalUsage.promptTokens}, completion: ${totalUsage.completionTokens})`);

    return {
      previewText: structure.previewText,
      blocks: generatedBlocks,
      usage: totalUsage,
    };
  } catch (error) {
    console.error('❌ [TWO-PASS-GEN] Fatal error:', error);
    throw error;
  }
}

