/**
 * TypeScript Types for AI Campaign Generation
 */

export type ToneType = 'professional' | 'friendly' | 'casual';
export type CampaignType = 'one-time' | 'sequence';
export type AIModel = 'gpt-4-turbo-preview' | 'gpt-4' | 'gemini-flash-2.5';
export type TemplateType = 'gradient-hero' | 'color-blocks' | 'bold-modern' | 'minimal-accent' | 'text-first';
export type GradientDirection = 'to-right' | 'to-bottom' | 'to-br';

/**
 * Design configuration for email
 */
export interface EmailDesign {
  template: TemplateType;
  headerGradient?: {
    from: string;
    to: string;
    direction: GradientDirection;
  };
  ctaColor: string;
  accentColor?: string;
  visualStyle: 'modern-clean' | 'bold-energetic' | 'minimal-professional';
}

/**
 * Input for generating a campaign
 */
export interface GenerateCampaignInput {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: ToneType;
  campaignType?: CampaignType;
  userId: string; // For tracking
}

/**
 * Generated email content
 */
export interface GeneratedEmail {
  subject: string;
  previewText: string;
  htmlBody: string;
  plainTextBody: string;
  ctaText: string;
  ctaUrl: string; // Will use placeholder {{cta_url}}
}

/**
 * Complete generated campaign response
 */
export interface GeneratedCampaign {
  campaignName: string;
  campaignType: CampaignType;
  recommendedSegment: string;
  design: EmailDesign;
  emails: GeneratedEmail[];
  segmentationSuggestion: string;
  sendTimeSuggestion: string;
  successMetrics: string;
}

/**
 * AI Generation metadata for tracking
 */
export interface AIGenerationMetadata {
  model: AIModel;
  modelVersion?: string;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  generationTimeMs: number;
  generatedAt: Date;
}

/**
 * Complete AI generation record (to save in database)
 */
export interface AIGenerationRecord {
  id?: string;
  userId: string;
  campaignId?: string;
  
  // Input
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: ToneType;
  campaignType?: CampaignType;
  
  // Output
  generatedContent: GeneratedCampaign;
  
  // Metadata
  model: AIModel;
  modelVersion?: string;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  generationTimeMs: number;
  
  // User feedback
  userAccepted?: boolean;
  userEdited?: boolean;
  versionNumber?: number;
}

/**
 * Error types for AI generation
 */
export class AIGenerationError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_API_KEY' | 'RATE_LIMIT' | 'INSUFFICIENT_QUOTA' | 'TIMEOUT' | 'INVALID_RESPONSE' | 'NETWORK_ERROR' | 'UNKNOWN',
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  canGenerate: boolean;
  resetDate?: Date;
}