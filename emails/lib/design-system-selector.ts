/**
 * Design System Selector
 * 
 * Detects the appropriate design system based on user prompt keywords.
 * No embeddings needed - simple, fast keyword matching.
 */

import { CorporateDesignSystem } from '../design-systems/corporate';
import { NewsletterDesignSystem } from '../design-systems/newsletter';
import { EcommerceDiscountDesignSystem } from '../design-systems/ecommerce-discount';
import { RetailWelcomeDesignSystem } from '../design-systems/retail-welcome';
import { ProductPromotionDesignSystem } from '../design-systems/product-promotion';
import { SaaSDesignSystem } from '../design-systems/saas';
import { EventAnnouncementDesignSystem } from '../design-systems/event-announcement';
import { WinBackReactivationDesignSystem } from '../design-systems/winback-reactivation';
import { FashionCampaignDesignSystem } from '../design-systems/fashion-campaign';
import { SaasEngagementDesignSystem } from '../design-systems/saas-engagement';
import { EventDesignSystem } from '../design-systems/event';
import { DestinationContentDesignSystem } from '../design-systems/destination-content';
import { SaasOnboardingWelcomeDesignSystem } from '../design-systems/saas-onboarding-welcome';
import { ModernStartupDesignSystem } from '../design-systems/startup';
import { MinimalElegantDesignSystem } from '../design-systems/minimal';
import { TravelBookingDesignSystem } from '../design-systems/travel';
import SaaSProductUpdateDesignSystem from '../design-systems/saas-product-update';
import ChangelogFeatureUpdateDesignSystem from '../design-systems/changelog-feature-update';
import ProductHuntLaunchDesignSystem from '../design-systems/product-hunt-launch';

export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  imageKeywords: {
    hero: string[];
    feature: string[];
    product: string[];
    background: string[];
    people?: string[];
  };
  system: string;
  exampleEmail?: string; // Optional - some design systems use inline examples instead
}

/**
 * All available design systems
 * Priority order: systems earlier in array are checked first
 */
const ALL_SYSTEMS: DesignSystem[] = [
  ProductHuntLaunchDesignSystem, // Product Hunt launches (very specific triggers)
  ProductPromotionDesignSystem,   // Product launches, collections, fashion (specific triggers)
  RetailWelcomeDesignSystem,      // Welcome/thank you emails (specific triggers)
  EcommerceDiscountDesignSystem,  // Discount/promo/sale/ecommerce campaigns
  TravelBookingDesignSystem,      // Travel/booking/destinations (highly specific)
  EventAnnouncementDesignSystem,  // Multi-event announcements/calendars
  WinBackReactivationDesignSystem, // Win-back/reactivation offers
  FashionCampaignDesignSystem,    // High-fashion/editorial campaigns
  ChangelogFeatureUpdateDesignSystem, // Changelog/release notes/feature updates
  SaaSProductUpdateDesignSystem,  // SaaS product updates/integrations/features
  SaasEngagementDesignSystem,     // SaaS next-action engagement
  DestinationContentDesignSystem, // Destination guides and travel inspiration
  SaasOnboardingWelcomeDesignSystem, // SaaS onboarding welcome
  EventDesignSystem,              // Events/conferences/webinars
  ModernStartupDesignSystem,      // Startup launches/beta/waitlist
  SaaSDesignSystem,               // SaaS/product features/onboarding
  MinimalElegantDesignSystem,     // Luxury brands/premium/design
  NewsletterDesignSystem,         // Content/blog focused
  CorporateDesignSystem,          // Corporate as fallback (broader keywords)
];

/**
 * Detect appropriate design system from user prompt
 * Uses simple keyword matching - no embeddings needed
 * 
 * @param prompt - User's generation prompt
 * @returns Best matching design system
 */
export function detectDesignSystem(prompt: string): DesignSystem {
  const lowerPrompt = prompt.toLowerCase();
  
  // Score each system based on keyword matches
  const scores = ALL_SYSTEMS.map(system => {
    const matches = system.triggers.filter(trigger => 
      lowerPrompt.includes(trigger.toLowerCase())
    );
    return { 
      system, 
      score: matches.length,
      matchedKeywords: matches 
    };
  });
  
  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  // Log detection for debugging
  if (scores[0].score > 0) {
    console.log(`✨ [DESIGN-SYSTEM] Detected: ${scores[0].system.name} (${scores[0].score} keyword matches: ${scores[0].matchedKeywords.join(', ')})`);
  } else {
    console.log(`✨ [DESIGN-SYSTEM] No keywords matched, using default: ${scores[0].system.name}`);
  }
  
  // Return best match (or first system if no matches)
  return scores[0].system;
}

/**
 * Get design system by ID (for manual override)
 * 
 * @param id - Design system ID
 * @returns Design system or null if not found
 */
export function getDesignSystemById(id: string): DesignSystem | null {
  return ALL_SYSTEMS.find(s => s.id === id) || null;
}

/**
 * Get all available design systems (for UI selection)
 * 
 * @returns Array of all design systems
 */
export function getAllDesignSystems(): DesignSystem[] {
  return ALL_SYSTEMS;
}

/**
 * Get design system names and IDs (for UI dropdowns)
 * 
 * @returns Array of {id, name} objects
 */
export function getDesignSystemOptions(): Array<{ id: string; name: string }> {
  return ALL_SYSTEMS.map(s => ({
    id: s.id,
    name: s.name
  }));
}

