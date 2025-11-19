/**
 * Semantic Email Generator (V2)
 * 
 * Generates emails using semantic blocks approach:
 * 1. AI generates semantic content blocks (hero, features, etc.)
 * 2. Transform functions convert blocks to React Email components
 * 
 * This ensures no empty Sections and deterministic structure
 */

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { EmailComponent, GlobalEmailSettings } from '../types';
import { EmailContentSchema, type EmailContent } from './blocks';
import { buildSemanticGenerationPrompt } from './prompts-v2';
import { transformBlocksToEmail } from './transforms';
import {
  createEmailWrapper,
  insertContentIntoWrapper,
  addPreviewToEmail,
} from '../template-wrapper';

// Initialize Google AI with API key
const getGoogleModel = (model: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
  }
  
  const google = createGoogleGenerativeAI({ apiKey });
  return google(model);
};

/**
 * Generation options
 */
export interface GenerationOptions {
  /** Temperature for AI generation (0-1) */
  temperature?: number;
  
  /** Model to use */
  model?: string;
  
  /** Email type for specialized prompting */
  emailType?: 'marketing' | 'transactional' | 'newsletter';
}

/**
 * Campaign-specific generation options
 */
export interface CampaignGenerationOptions extends GenerationOptions {
  /** Campaign name */
  campaignName?: string;
  
  /** Campaign type */
  campaignType?: 'one-time' | 'sequence' | 'newsletter';
  
  /** Company name for branding */
  companyName?: string;
  
  /** Target audience description */
  targetAudience?: string;
}

/**
 * Generation result with metadata
 */
export interface GenerationResult {
  /** Generated email component tree */
  email: EmailComponent;
  
  /** Generation metadata */
  metadata: {
    model: string;
    tokens: number;
    timeMs: number;
    blocksGenerated: number;
  };
}

/**
 * Campaign-level metadata extracted from generation
 */
export interface CampaignMetadata {
  /** Suggested campaign name */
  campaignName: string;
  
  /** Recommended audience segment */
  recommendedSegment: string;
  
  /** Suggested send time */
  sendTimeSuggestion: string;
}

/**
 * Campaign generation result with campaign metadata
 */
export interface CampaignGenerationResult extends GenerationResult {
  /** Campaign-specific metadata */
  campaignMetadata: CampaignMetadata;
}

/**
 * Generate semantic email content blocks from user prompt
 * 
 * Phase 1: AI generates semantic blocks (hero, features, cta, footer, etc.)
 * This is the core semantic generation that replaces direct component generation
 * 
 * @param prompt - User's natural language prompt
 * @param settings - Global email settings (colors, fonts, etc.)
 * @param options - Generation options
 * @returns EmailContent with semantic blocks
 */
export async function generateSemanticBlocks(
  prompt: string,
  settings: GlobalEmailSettings,
  options: CampaignGenerationOptions = {}
): Promise<{ content: EmailContent; usage: any }> {
  const startTime = Date.now();
  
  const {
    temperature = 0.3,
    model = 'gemini-2.0-flash-exp',
    emailType,
    campaignType,
    companyName,
    targetAudience,
  } = options;
  
  console.log('🤖 [SEMANTIC-GEN] Generating semantic content blocks');
  console.log('📝 [SEMANTIC-GEN] Prompt:', prompt);
  console.log('📧 [SEMANTIC-GEN] Email type:', emailType || 'auto');
  console.log('⚙️  [SEMANTIC-GEN] Model:', model);
  
  try {
    const { object, usage } = await generateObject({
      model: getGoogleModel(model),
      schema: EmailContentSchema,
      prompt: buildSemanticGenerationPrompt(prompt, settings, emailType, {
        campaignType,
        companyName,
        targetAudience,
      }),
      temperature,
    });
    
    const timeMs = Date.now() - startTime;
    
    console.log('✅ [SEMANTIC-GEN] Content generated successfully');
    console.log(`📊 [SEMANTIC-GEN] Tokens: ${usage?.totalTokens || 'unknown'}`);
    console.log(`⏱️  [SEMANTIC-GEN] Time: ${timeMs}ms`);
    console.log(`📦 [SEMANTIC-GEN] Blocks: ${object.blocks.length}`);
    
    // Log block types for debugging
    const blockTypes = object.blocks.map(b => b.blockType);
    console.log(`🎯 [SEMANTIC-GEN] Block types: ${blockTypes.join(', ')}`);
    
    // Validate we have essential blocks
    const hasFooter = object.blocks.some(b => b.blockType === 'footer');
    if (!hasFooter) {
      console.warn('⚠️  [SEMANTIC-GEN] Warning: No footer block generated');
    }
    
    return { content: object, usage };
    
  } catch (error) {
    console.error('❌ [SEMANTIC-GEN] Generation failed:', error);
    
    if (error instanceof Error) {
      throw new Error(`Semantic generation failed: ${error.message}`);
    }
    throw new Error('Semantic generation failed: Unknown error');
  }
}

/**
 * Generate complete email with semantic blocks approach
 * 
 * Full pipeline:
 * 1. AI generates semantic content blocks
 * 2. Transform blocks to React Email components
 * 3. Insert into email wrapper
 * 4. Add preview text
 * 5. Return complete email
 * 
 * @param prompt - User's natural language prompt
 * @param settings - Global email settings
 * @param options - Generation options
 * @returns Complete email with wrapper
 */
export async function generateEmailSemantic(
  prompt: string,
  settings: GlobalEmailSettings,
  options: CampaignGenerationOptions = {}
): Promise<GenerationResult> {
  const startTime = Date.now();
  
  console.log('🚀 [EMAIL-GEN-V2] Starting semantic email generation');
  
  // Phase 1: Generate semantic content blocks
  const { content, usage } = await generateSemanticBlocks(prompt, settings, options);
  
  console.log('🔄 [EMAIL-GEN-V2] Transforming blocks to React Email components');
  
  // Phase 2: Transform semantic blocks to React Email components
  const sections = transformBlocksToEmail(content.blocks, settings);
  
  console.log(`✅ [EMAIL-GEN-V2] Transformed ${sections.length} blocks to components`);
  
  // Verify no empty sections
  const emptySections = sections.filter(
    s => s.component === 'Section' && (!s.children || s.children.length === 0)
  );
  
  if (emptySections.length > 0) {
    console.error('❌ [EMAIL-GEN-V2] CRITICAL: Empty sections detected!', emptySections);
    throw new Error('Transform generated empty sections - this should never happen');
  }
  
  // Create wrapper structure
  const wrapper = createEmailWrapper(settings);
  
  // Insert content into wrapper
  let fullEmail = insertContentIntoWrapper(wrapper, sections);
  
  // Add preview text to Head
  if (content.previewText) {
    fullEmail = addPreviewToEmail(fullEmail, content.previewText);
  }
  
  const timeMs = Date.now() - startTime;
  
  console.log('✅ [EMAIL-GEN-V2] Email generation complete');
  console.log(`⏱️  [EMAIL-GEN-V2] Total time: ${timeMs}ms`);
  
  return {
    email: fullEmail,
    metadata: {
      model: options.model || 'gemini-2.0-flash-exp',
      tokens: usage?.totalTokens || 0,
      timeMs,
      blocksGenerated: content.blocks.length,
    },
  };
}

/**
 * Extract campaign metadata from prompt and context
 * 
 * Generates intelligent suggestions for campaign management
 * 
 * @param prompt - User's campaign prompt
 * @param options - Campaign generation options
 * @returns Campaign metadata with recommendations
 */
function extractCampaignMetadata(
  prompt: string,
  options: CampaignGenerationOptions
): CampaignMetadata {
  // Extract campaign name from options or generate from prompt
  const campaignName = options.campaignName || 
    `Campaign - ${new Date().toLocaleDateString()}`;
  
  // Determine recommended segment based on campaign type and audience
  let recommendedSegment = 'all_contacts';
  if (options.targetAudience) {
    const audience = options.targetAudience.toLowerCase();
    if (audience.includes('new') || audience.includes('trial')) {
      recommendedSegment = 'new_users';
    } else if (audience.includes('active') || audience.includes('engaged')) {
      recommendedSegment = 'active_users';
    } else if (audience.includes('premium') || audience.includes('paid')) {
      recommendedSegment = 'premium_users';
    } else if (audience.includes('inactive') || audience.includes('churn')) {
      recommendedSegment = 'inactive_users';
    }
  }
  
  // Suggest optimal send time based on campaign type
  let sendTimeSuggestion = 'Tuesday 10am local time';
  if (options.campaignType === 'newsletter') {
    sendTimeSuggestion = 'Thursday 9am local time';
  } else if (options.emailType === 'transactional') {
    sendTimeSuggestion = 'Immediate (transactional)';
  } else if (prompt.toLowerCase().includes('weekend') || prompt.toLowerCase().includes('friday')) {
    sendTimeSuggestion = 'Friday 11am local time';
  }
  
  return {
    campaignName,
    recommendedSegment,
    sendTimeSuggestion,
  };
}

/**
 * Generate complete V2 campaign with semantic blocks and campaign metadata
 * 
 * This is the main entry point for V2 campaign generation. It extends
 * generateEmailSemantic() with campaign-specific features:
 * - Campaign metadata extraction (name, segment, send time)
 * - Campaign type context (one-time, sequence, newsletter)
 * - Target audience and company branding
 * 
 * @param prompt - User's campaign prompt
 * @param settings - Global email settings (colors, fonts, etc.)
 * @param options - Campaign-specific options
 * @returns Complete campaign with email and metadata
 */
export async function generateCampaignV2(
  prompt: string,
  settings: GlobalEmailSettings,
  options: CampaignGenerationOptions = {}
): Promise<CampaignGenerationResult> {
  console.log('🚀 [CAMPAIGN-GEN-V2] Starting V2 campaign generation');
  console.log('📝 [CAMPAIGN-GEN-V2] Campaign type:', options.campaignType || 'one-time');
  console.log('🏢 [CAMPAIGN-GEN-V2] Company:', options.companyName || 'N/A');
  console.log('👥 [CAMPAIGN-GEN-V2] Audience:', options.targetAudience || 'general');
  
  // Generate email using semantic blocks approach
  const emailResult = await generateEmailSemantic(prompt, settings, {
    temperature: options.temperature,
    model: options.model,
    emailType: options.emailType,
  });
  
  console.log('✅ [CAMPAIGN-GEN-V2] Email generated successfully');
  
  // Extract campaign-level metadata from prompt/context
  const campaignMetadata = extractCampaignMetadata(prompt, options);
  
  console.log('📊 [CAMPAIGN-GEN-V2] Campaign metadata:', {
    name: campaignMetadata.campaignName,
    segment: campaignMetadata.recommendedSegment,
    sendTime: campaignMetadata.sendTimeSuggestion,
  });
  
  console.log('✅ [CAMPAIGN-GEN-V2] Campaign generation complete');
  
  return {
    ...emailResult,
    campaignMetadata,
  };
}

/**
 * Test the semantic generator with a simple prompt
 */
export async function testSemanticGenerator(): Promise<void> {
  const testPrompt = 'Create a welcome email for a productivity SaaS app';
  const testSettings: GlobalEmailSettings = {
    primaryColor: '#7c3aed',
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '600px',
  };
  
  console.log('\n🧪 Testing Semantic Email Generator...\n');
  
  try {
    const result = await generateEmailSemantic(testPrompt, testSettings, {
      emailType: 'marketing',
    });
    
    console.log('\n✅ Semantic generator test passed!');
    console.log('Generated email with', result.metadata.blocksGenerated, 'blocks');
    console.log('Total time:', result.metadata.timeMs, 'ms');
    console.log('Total tokens:', result.metadata.tokens);
    
  } catch (error) {
    console.error('\n❌ Semantic generator test failed:', error);
    throw error;
  }
}

