/**
 * AI Campaign Generator - Validation Schemas V2
 * 
 * Zod schemas for type-safe validation using new Flodesk-pattern block system
 * 11 base blocks + 50+ layout variations
 */

import { z } from 'zod';
import { 
  BlockSchema, 
  EmailSchema, 
  CampaignSchema,
  type Block,
  type Email,
  type Campaign
} from '../email/blocks/schemas-v2';

// Re-export types for compatibility
export type GeneratedCampaign = Campaign;
export type GeneratedBlockEmail = Email;
export type EmailBlock = Block;

// ============================================================================
// Input Validation Schemas
// ============================================================================

/**
 * User input for campaign generation
 */
export const GenerateCampaignInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  userId: z.string().uuid('Invalid user ID'),
  companyName: z.string().optional(),
  productDescription: z.string().max(500).optional(),
  targetAudience: z.string().max(300).optional(),
  tone: z.enum(['professional', 'friendly', 'casual']).optional().default('friendly'),
  campaignType: z.enum(['one-time', 'sequence']).optional().default('one-time'),
});

export type GenerateCampaignInput = z.infer<typeof GenerateCampaignInputSchema>;

// ============================================================================
// AI Response Validation Schemas
// ============================================================================

/**
 * Content section schema (flexible structure)
 */
const ContentSectionSchema = z.object({
  type: z.enum(['text', 'heading', 'list', 'divider', 'spacer', 'hero', 'feature-grid', 'testimonial', 'stats', 'comparison', 'cta-block']),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  }).optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  comparison: z.object({
    before: z.string(),
    after: z.string(),
  }).optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  layout: z.enum(['1-col', '2-col', '3-col', 'centered', 'alternating']).optional(),
});

/**
 * Email structure from AI (legacy section-based format)
 */
const GeneratedEmailSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().min(1).max(150),
  sections: z.array(ContentSectionSchema).min(1),
  layoutSuggestion: z.enum(['default', 'centered', 'story-flow']).optional(),
  emphasisAreas: z.array(z.string()).optional(),
  notes: z.string().optional(),
  // Legacy fields (for backward compatibility during transition)
  htmlBody: z.string().optional(),
  plainTextBody: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
});

// ============================================================================
// Legacy schemas removed - now using V2 schemas from schemas-v2.ts
// ============================================================================

// Re-export V2 schemas for use in this module
export { EmailSchema as GeneratedBlockEmailSchema } from '../email/blocks/schemas-v2';
export { CampaignSchema as GeneratedCampaignSchema } from '../email/blocks/schemas-v2';

// Type exports for backward compatibility
export type GeneratedEmail = Email; // Legacy type alias
export type DesignConfig = Campaign['design']; // Extract design type from Campaign

// Removed: fixSchemaForStrictMode() - No longer needed with Gemini's native Zod support!

/**
 * Get the campaign Zod schema for AI generation
 * V2: Gemini-optimized schema with 11 base blocks + layout variations
 */
export function getCampaignSchema(): z.ZodType<any> {
  return CampaignSchema;
}

/**
 * Type guard to check if email is block-based (all emails are now block-based)
 */
export function isBlockBasedEmail(email: GeneratedBlockEmail): email is GeneratedBlockEmail {
  return 'blocks' in email && Array.isArray(email.blocks);
}

// ============================================================================
// Generation Result Schema
// ============================================================================

/**
 * Complete result including metadata
 */
export const GenerationResultSchema = z.object({
  id: z.string().uuid(),
  campaign: CampaignSchema,
  metadata: z.object({
    model: z.string(),
    tokensUsed: z.number(),
    promptTokens: z.number(),
    completionTokens: z.number(),
    costUsd: z.number(),
    generationTimeMs: z.number(),
    generatedAt: z.date(),
  }),
});

export type GenerationResult = z.infer<typeof GenerationResultSchema>;

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate and parse user input
 */
export function validateCampaignInput(input: unknown): GenerateCampaignInput {
  try {
    return GenerateCampaignInputSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(`Invalid input: ${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }
}

/**
 * Validate and parse AI response
 */
export function validateAIResponse(response: unknown): GeneratedCampaign {
  try {
    return CampaignSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('🔍 [VALIDATOR] Zod validation error count:', error.issues?.length || 0);
      console.error('🔍 [VALIDATOR] Zod errors:', error.issues);
      const errors = (error.issues || []).map((e) => {
        const path = e.path && e.path.length > 0 ? e.path.join('.') : 'root';
        return `${path}: ${e.message}`;
      }).join(', ');
      throw new Error(`Invalid AI response: ${errors}`);
    }
    throw error;
  }
}

/**
 * Safely parse JSON with validation
 * NOTE: When using Structured Outputs, this is mainly for type checking
 * as OpenAI guarantees schema compliance
 */
export function parseAndValidateCampaign(jsonString: string): GeneratedCampaign {
  try {
    const parsed = JSON.parse(jsonString);
    console.log('📋 [VALIDATOR] Parsed campaign structure:', {
      campaignName: parsed?.campaignName,
      emailCount: parsed?.emails?.length,
      hasBlocks: parsed?.emails?.[0]?.blocks ? true : false,
      firstBlockType: parsed?.emails?.[0]?.blocks?.[0]?.type
    });
    
    // With Structured Outputs, OpenAI guarantees schema compliance
    // So we can trust the structure and just do type checking
    return validateAIResponse(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON');
    }
    throw error;
  }
}

/**
 * Parse structured output directly (no JSON parsing needed)
 * Used when OpenAI Structured Outputs returns typed object
 */
export function parseStructuredCampaign(data: unknown): GeneratedCampaign {
  // Remove _flexible placeholder properties that Gemini adds
  let cleanedData = removeFlexiblePlaceholders(data);
  
  // DEBUG: Log the actual structure we received
  console.log('🔍 [VALIDATOR] Raw cleaned data keys:', Object.keys(cleanedData as any));
  console.log('🔍 [VALIDATOR] Raw JSON preview (first 500 chars):', JSON.stringify(cleanedData).substring(0, 500));
  
  // FALLBACK: If Gemini returned just blocks array, wrap it in full campaign structure
  if ((cleanedData as any).blocks && !(cleanedData as any).campaignName && !(cleanedData as any).emails) {
    console.log('🔧 [VALIDATOR] Wrapping bare blocks array into full campaign structure');
    cleanedData = {
      campaignName: "Generated Campaign",
      campaignType: "one-time" as const,
      recommendedSegment: "all_contacts",
      strategy: {
        goal: "Engage users with generated content",
        keyMessage: "Auto-generated from blocks"
      },
      design: {
        template: "minimal-accent" as const,
        ctaColor: "#7c3aed",
        accentColor: "#a78bfa"
      },
      emails: [{
        subject: "Generated Email",
        previewText: "Auto-generated email preview",
        blocks: (cleanedData as any).blocks,
        globalSettings: {
          backgroundColor: "#f9fafb",
          contentBackgroundColor: "#ffffff",
          maxWidth: 600,
          fontFamily: "system-ui, -apple-system, sans-serif",
          mobileBreakpoint: 480, // Standard mobile breakpoint
        }
      }],
      segmentationSuggestion: "all_contacts",
      sendTimeSuggestion: "Tuesday 10am local",
      successMetrics: "Open >25%, Click >3%"
    };
  }
  
  // FALLBACK: Ensure all emails have globalSettings with mobileBreakpoint
  if ((cleanedData as any).emails) {
    (cleanedData as any).emails = (cleanedData as any).emails.map((email: any) => {
      if (!email.globalSettings) {
        email.globalSettings = {
          backgroundColor: "#f9fafb",
          contentBackgroundColor: "#ffffff",
          maxWidth: 600,
          fontFamily: "system-ui, -apple-system, sans-serif",
          mobileBreakpoint: 480, // Standard mobile breakpoint
        };
      } else if (!email.globalSettings.mobileBreakpoint) {
        // Add default mobileBreakpoint if missing
        email.globalSettings.mobileBreakpoint = 480;
      }
      return email;
    });
    console.log('✅ [VALIDATOR] Ensured all emails have mobileBreakpoint (default: 480px)');
  }
  
  // CRITICAL: Filter out blocks with empty/broken image URLs
  if ((cleanedData as any).emails) {
    (cleanedData as any).emails = (cleanedData as any).emails.map((email: any) => {
      if (email.blocks) {
        const originalCount = email.blocks.length;
        email.blocks = email.blocks.filter((block: any) => {
          // Filter out image blocks with empty URLs
          if (block.type === 'image' && block.content) {
            const hasValidImage = block.content.images?.some((img: any) => 
              img.url && img.url !== '' && !img.url.includes('example.com')
            ) || (block.content.imageUrl && block.content.imageUrl !== '' && !block.content.imageUrl.includes('example.com'));
            
            if (!hasValidImage) {
              console.log('🚫 [VALIDATOR] Filtering out image block with empty/invalid URL:', block.id);
              return false;
            }
          }
          
          // Filter out logo blocks with empty URLs
          if (block.type === 'logo' && block.content) {
            if (!block.content.imageUrl || block.content.imageUrl === '' || block.content.imageUrl.includes('example.com')) {
              console.log('🚫 [VALIDATOR] Filtering out logo block with empty/invalid URL:', block.id);
              return false;
            }
          }
          
          // Filter out layout blocks with image-focused variations that have empty image URLs
          if (block.type === 'layouts' && block.content) {
            const imageVariations = [
              'hero-image-overlay', 'image-overlay-center', 'image-overlay-top-left',
              'image-overlay-top-right', 'image-overlay-bottom-left', 'image-overlay-bottom-right',
              'image-overlay-center-bottom', 'image-collage-featured-left', 'image-collage-featured-right',
              'image-collage-featured-center', 'zigzag-2-rows', 'zigzag-3-rows', 'zigzag-4-rows',
              'product-card-image-top', 'product-card-image-left', 'badge-overlay-corner',
              'badge-overlay-center', 'testimonial-with-image'
            ];
            
            if (imageVariations.includes(block.layoutVariation)) {
              const hasImage = block.content.image?.url || block.content.imageUrl;
              if (!hasImage || hasImage === '' || hasImage.includes('example.com')) {
                console.log('🚫 [VALIDATOR] Filtering out image-focused layout block with empty/invalid URL:', block.id, block.layoutVariation);
                return false;
              }
            }
          }
          
          return true;
        });
        
        // Re-index positions after filtering
        email.blocks = email.blocks.map((block: any, index: number) => ({
          ...block,
          position: index,
        }));
        
        const filteredCount = originalCount - email.blocks.length;
        if (filteredCount > 0) {
          console.log(`✅ [VALIDATOR] Filtered out ${filteredCount} blocks with broken images`);
        }
      }
      return email;
    });
  }
  
  // Structured Outputs guarantees schema compliance, so this is mainly type checking
  console.log('📋 [VALIDATOR] Parsing structured campaign:', {
    campaignName: (cleanedData as any)?.campaignName,
    emailCount: (cleanedData as any)?.emails?.length,
  });
  
  // DEBUG: Log first few blocks to see what layoutVariation values Gemini is generating
  const firstEmail = (cleanedData as any)?.emails?.[0];
  if (firstEmail?.blocks) {
    console.log('🔍 [VALIDATOR] First 10 blocks from Gemini:');
    firstEmail.blocks.slice(0, 10).forEach((block: any, idx: number) => {
      console.log(`  Block ${idx}:`, {
        id: block.id,
        type: block.type,
        layoutVariation: block.layoutVariation,
        layoutVariationType: typeof block.layoutVariation,
        hasSettings: !!block.settings,
        hasContent: !!block.content,
      });
    });
    
    // Also check ALL blocks with issues
    const problematicBlocks = firstEmail.blocks.filter((b: any) => 
      b.type === 'layouts' && (!b.layoutVariation || b.layoutVariation === '')
    );
    if (problematicBlocks.length > 0) {
      console.log(`⚠️ [VALIDATOR] Found ${problematicBlocks.length} layouts blocks with missing/empty layoutVariation`);
    }
  } else {
    console.log('⚠️ [VALIDATOR] No emails or blocks found in response!');
  }
  
  return validateAIResponse(cleanedData);
}

/**
 * Remove _flexible placeholder properties added by Gemini schema workaround
 */
function removeFlexiblePlaceholders(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeFlexiblePlaceholders);
  }
  
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip the _flexible placeholder property
    if (key === '_flexible') {
      continue;
    }
    cleaned[key] = removeFlexiblePlaceholders(value);
  }
  
  return cleaned;
}

