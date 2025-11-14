/**
 * AI Section Selection System
 * 
 * Intelligently recommends section templates based on user prompts
 * and campaign context to reduce AI decision complexity.
 */

import { getAllSections, getRecommendedSections } from '../email/sections';
import type { SectionTemplate, SectionCategory } from '../email/sections';

// ============================================================================
// Types
// ============================================================================

export interface SectionRecommendation {
  section: SectionTemplate;
  score: number;
  reason: string;
}

export interface SelectionContext {
  prompt: string;
  campaignType?: 'one-time' | 'drip' | 'newsletter';
  tone?: string;
  targetAudience?: string;
  emailType?: 'welcome' | 'promo' | 'announcement' | 'newsletter' | 'transactional';
}

// ============================================================================
// Section Selection Algorithm
// ============================================================================

/**
 * Select the best section templates for a given context
 * Returns top 3-5 recommendations to send to AI
 */
export function selectSectionsForContext(
  context: SelectionContext,
  maxRecommendations: number = 5
): SectionRecommendation[] {
  const allSections = getAllSections();
  
  // Extract keywords from prompt
  const keywords = extractKeywords(context.prompt);
  
  // Score each section
  const scoredSections = allSections.map(section => {
    let score = 0;
    let reasons: string[] = [];
    
    // 1. Keyword matching (50% weight)
    const keywordScore = scoreKeywordMatch(section, keywords);
    score += keywordScore * 0.5;
    if (keywordScore > 50) {
      reasons.push('keyword match');
    }
    
    // 2. Campaign type matching (30% weight)
    if (context.campaignType || context.emailType) {
      const typeScore = scoreCampaignTypeMatch(section, context);
      score += typeScore * 0.3;
      if (typeScore > 70) {
        reasons.push('campaign type match');
      }
    }
    
    // 3. Use case matching (10% weight)
    const useCaseScore = scoreUseCaseMatch(section, keywords, context);
    score += useCaseScore * 0.1;
    
    // 4. Selection weight (10% weight)
    score += section.aiContext.selectionWeight * 0.1;
    
    return {
      section,
      score,
      reason: reasons.length > 0 ? reasons.join(', ') : 'general relevance',
    };
  });
  
  // Sort by score and return top N
  return scoredSections
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
}

/**
 * Get sections for a specific category with context
 */
export function selectSectionsByCategory(
  category: SectionCategory,
  context: SelectionContext,
  maxRecommendations: number = 3
): SectionRecommendation[] {
  const allSections = getAllSections().filter(s => s.category === category);
  const keywords = extractKeywords(context.prompt);
  
  const scoredSections = allSections.map(section => {
    const keywordScore = scoreKeywordMatch(section, keywords);
    
    return {
      section,
      score: keywordScore + section.aiContext.selectionWeight * 0.2,
      reason: `${category} section`,
    };
  });
  
  return scoredSections
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Score keyword match between section and keywords
 */
function scoreKeywordMatch(section: SectionTemplate, keywords: string[]): number {
  if (keywords.length === 0) return 50; // Default score
  
  let matchCount = 0;
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    
    // Check AI context keywords
    if (section.aiContext.keywords.some(k => k.toLowerCase().includes(keywordLower))) {
      matchCount += 3;
    }
    
    // Check use cases
    if (section.useCases.some(uc => uc.toLowerCase().includes(keywordLower))) {
      matchCount += 2;
    }
    
    // Check bestFor
    if (section.aiContext.bestFor.some(bf => bf.toLowerCase().includes(keywordLower))) {
      matchCount += 4;
    }
    
    // Check name and description
    if (section.name.toLowerCase().includes(keywordLower)) {
      matchCount += 2;
    }
    if (section.description.toLowerCase().includes(keywordLower)) {
      matchCount += 1;
    }
  });
  
  // Normalize to 0-100 scale
  const maxPossibleScore = keywords.length * 12; // Max points per keyword
  return Math.min((matchCount / maxPossibleScore) * 100, 100);
}

/**
 * Score campaign type match
 */
function scoreCampaignTypeMatch(section: SectionTemplate, context: SelectionContext): number {
  const emailType = context.emailType || inferEmailType(context.prompt);
  
  const typeToCategory: Record<string, SectionCategory[]> = {
    welcome: ['hero', 'content', 'cta'],
    promo: ['promo', 'hero', 'cta', 'social-proof'],
    announcement: ['hero', 'content', 'cta'],
    newsletter: ['content', 'hero', 'social-proof'],
    transactional: ['hero', 'content'],
  };
  
  const preferredCategories = typeToCategory[emailType] || [];
  
  if (preferredCategories.includes(section.category)) {
    return 100;
  }
  
  return 30; // Fallback score
}

/**
 * Score use case match
 */
function scoreUseCaseMatch(
  section: SectionTemplate,
  keywords: string[],
  context: SelectionContext
): number {
  const combinedText = `${context.prompt} ${context.tone || ''} ${context.targetAudience || ''}`.toLowerCase();
  
  let matches = 0;
  
  section.useCases.forEach(useCase => {
    if (combinedText.includes(useCase.toLowerCase())) {
      matches++;
    }
  });
  
  return Math.min((matches / section.useCases.length) * 100, 100);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract meaningful keywords from prompt
 */
function extractKeywords(prompt: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
  
  // Convert to lowercase and split into words
  const words = prompt.toLowerCase().split(/\s+/);
  
  // Filter out stop words and short words
  const keywords = words.filter(word => {
    return word.length > 3 && !stopWords.includes(word);
  });
  
  // Remove duplicates
  return Array.from(new Set(keywords));
}

/**
 * Infer email type from prompt
 */
function inferEmailType(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('welcome') || promptLower.includes('onboard')) {
    return 'welcome';
  }
  if (promptLower.includes('sale') || promptLower.includes('discount') || promptLower.includes('promo')) {
    return 'promo';
  }
  if (promptLower.includes('announce') || promptLower.includes('update')) {
    return 'announcement';
  }
  if (promptLower.includes('newsletter') || promptLower.includes('digest')) {
    return 'newsletter';
  }
  
  return 'announcement'; // Default
}

/**
 * Format section recommendations for AI consumption
 */
export function formatRecommendationsForAI(
  recommendations: SectionRecommendation[]
): string {
  return recommendations.map((rec, index) => {
    return `${index + 1}. ${rec.section.id} - "${rec.section.name}"
   Category: ${rec.section.category}
   Use for: ${rec.section.aiContext.bestFor.join(', ')}
   Contains: ${rec.section.blocks.length} blocks (${rec.section.blocks.map(b => b.type).join(', ')})`;
  }).join('\n\n');
}

