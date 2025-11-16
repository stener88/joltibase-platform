/**
 * AI Hints and Recommendations
 * 
 * AI-powered block recommendations based on use case
 */

import type { BlockType } from '../types';
import type { BlockDefinition } from './definitions';
import { BLOCK_DEFINITIONS } from './definitions';

/**
 * Get AI recommendations for block usage based on campaign type
 */
export function getAIBlockRecommendations(campaignType: string): BlockType[] {
  const lowerType = campaignType.toLowerCase();
  
  // Product launch
  if (lowerType.includes('launch') || lowerType.includes('announcement')) {
    return ['logo', 'text', 'image', 'button'];
  }
  
  // Newsletter
  if (lowerType.includes('newsletter') || lowerType.includes('update')) {
    return ['logo', 'text', 'divider', 'image', 'button'];
  }
  
  // Promotion
  if (lowerType.includes('promo') || lowerType.includes('sale') || lowerType.includes('discount')) {
    return ['logo', 'text', 'button', 'spacer'];
  }
  
  // Welcome
  if (lowerType.includes('welcome') || lowerType.includes('onboard')) {
    return ['logo', 'text', 'image', 'button'];
  }
  
  // Testimonial/Social proof
  if (lowerType.includes('testimonial') || lowerType.includes('proof')) {
    return ['logo', 'text', 'button'];
  }
  
  // Default structure
  return ['logo', 'text', 'button', 'footer'];
}

/**
 * Get recommended blocks for a specific use case
 */
export function getBlocksForUseCase(useCase: string): BlockDefinition[] {
  const recommendedTypes = getAIBlockRecommendations(useCase);
  return recommendedTypes.map(type => BLOCK_DEFINITIONS[type]);
}

