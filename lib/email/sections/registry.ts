/**
 * Section Template Registry
 * 
 * Central registry for all section templates with helper functions
 * for retrieval, filtering, and searching.
 */

import type { SectionTemplate, SectionCategory, SectionFilter, SectionSearchResult, DesignStyle, Complexity } from './types';

// ============================================================================
// Section Registry (will be populated with templates)
// ============================================================================

const SECTION_REGISTRY: Map<string, SectionTemplate> = new Map();

// ============================================================================
// Registry Management
// ============================================================================

/**
 * Register a section template
 */
export function registerSection(section: SectionTemplate): void {
  SECTION_REGISTRY.set(section.id, section);
}

/**
 * Register multiple section templates
 */
export function registerSections(sections: SectionTemplate[]): void {
  sections.forEach(section => registerSection(section));
}

/**
 * Get all registered sections
 */
export function getAllSections(): SectionTemplate[] {
  return Array.from(SECTION_REGISTRY.values());
}

// ============================================================================
// Retrieval Functions
// ============================================================================

/**
 * Get a section template by ID
 */
export function getSectionById(id: string): SectionTemplate | undefined {
  return SECTION_REGISTRY.get(id);
}

/**
 * Get sections by category
 */
export function getSectionsByCategory(category: SectionCategory): SectionTemplate[] {
  return getAllSections().filter(section => section.category === category);
}

/**
 * Get sections by design style
 */
export function getSectionsByStyle(style: DesignStyle): SectionTemplate[] {
  return getAllSections().filter(section => section.designStyle === style);
}

/**
 * Get sections by complexity
 */
export function getSectionsByComplexity(complexity: Complexity): SectionTemplate[] {
  return getAllSections().filter(section => section.complexity === complexity);
}

// ============================================================================
// Filtering & Search
// ============================================================================

/**
 * Filter sections based on multiple criteria
 */
export function filterSections(filter: SectionFilter): SectionTemplate[] {
  let results = getAllSections();
  
  // Filter by category
  if (filter.category) {
    results = results.filter(section => section.category === filter.category);
  }
  
  // Filter by design style
  if (filter.designStyle) {
    results = results.filter(section => section.designStyle === filter.designStyle);
  }
  
  // Filter by complexity
  if (filter.complexity) {
    results = results.filter(section => section.complexity === filter.complexity);
  }
  
  // Filter by use cases
  if (filter.useCases && filter.useCases.length > 0) {
    results = results.filter(section => 
      filter.useCases!.some(useCase => 
        section.useCases.includes(useCase) || 
        section.aiContext.bestFor.includes(useCase)
      )
    );
  }
  
  // Filter by search query
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    results = results.filter(section => 
      section.name.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.useCases.some(uc => uc.toLowerCase().includes(query)) ||
      section.aiContext.keywords.some(kw => kw.toLowerCase().includes(query))
    );
  }
  
  return results;
}

/**
 * Search sections with relevance scoring
 */
export function searchSections(query: string): SectionSearchResult[] {
  if (!query || query.trim() === '') {
    return getAllSections().map(section => ({
      section,
      relevanceScore: 50, // Default score
    }));
  }
  
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  const results = getAllSections().map(section => {
    let score = 0;
    
    // Name match (highest weight)
    if (section.name.toLowerCase().includes(queryLower)) {
      score += 50;
    }
    
    // Description match
    if (section.description.toLowerCase().includes(queryLower)) {
      score += 30;
    }
    
    // Use case match
    section.useCases.forEach(useCase => {
      if (useCase.toLowerCase().includes(queryLower)) {
        score += 25;
      }
    });
    
    // Keyword match (AI context)
    section.aiContext.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(queryLower)) {
        score += 20;
      }
    });
    
    // Best for match
    section.aiContext.bestFor.forEach(bestFor => {
      if (bestFor.toLowerCase().includes(queryLower)) {
        score += 15;
      }
    });
    
    // Word-by-word partial matching
    words.forEach(word => {
      if (section.name.toLowerCase().includes(word)) score += 10;
      if (section.description.toLowerCase().includes(word)) score += 5;
    });
    
    // Add selection weight bonus
    score += section.aiContext.selectionWeight * 0.1;
    
    return {
      section,
      relevanceScore: Math.min(score, 100), // Cap at 100
    };
  });
  
  // Filter out sections with very low scores and sort by relevance
  return results
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// Recommendation Functions
// ============================================================================

/**
 * Get recommended sections based on keywords
 */
export function getRecommendedSections(keywords: string[], limit: number = 5): SectionTemplate[] {
  const keywordsLower = keywords.map(k => k.toLowerCase());
  
  const scored = getAllSections().map(section => {
    let score = 0;
    
    // Match against AI keywords
    keywordsLower.forEach(keyword => {
      section.aiContext.keywords.forEach(sectionKeyword => {
        if (sectionKeyword.toLowerCase().includes(keyword)) {
          score += 20;
        }
      });
      
      // Match against use cases
      section.useCases.forEach(useCase => {
        if (useCase.toLowerCase().includes(keyword)) {
          score += 15;
        }
      });
      
      // Match against best for
      section.aiContext.bestFor.forEach(bestFor => {
        if (bestFor.toLowerCase().includes(keyword)) {
          score += 25;
        }
      });
    });
    
    // Add selection weight
    score += section.aiContext.selectionWeight * 0.5;
    
    return { section, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.section);
}

/**
 * Get popular sections (by selection weight)
 */
export function getPopularSections(limit: number = 10): SectionTemplate[] {
  return getAllSections()
    .sort((a, b) => b.aiContext.selectionWeight - a.aiContext.selectionWeight)
    .slice(0, limit);
}

// ============================================================================
// Category Information
// ============================================================================

export interface CategoryInfo {
  id: SectionCategory;
  name: string;
  description: string;
  icon: string;
  count: number;
}

/**
 * Get category information with section counts
 */
export function getCategoryInfo(): CategoryInfo[] {
  const sections = getAllSections();
  
  return [
    {
      id: 'hero',
      name: 'Hero',
      description: 'Large headline sections for email openings',
      icon: '⭐',
      count: sections.filter(s => s.category === 'hero').length,
    },
    {
      id: 'promo',
      name: 'Promo',
      description: 'Promotional sections for sales and offers',
      icon: '🎉',
      count: sections.filter(s => s.category === 'promo').length,
    },
    {
      id: 'content',
      name: 'Content',
      description: 'Text and image content sections',
      icon: '📝',
      count: sections.filter(s => s.category === 'content').length,
    },
    {
      id: 'social-proof',
      name: 'Social Proof',
      description: 'Testimonials, reviews, and trust indicators',
      icon: '💬',
      count: sections.filter(s => s.category === 'social-proof').length,
    },
    {
      id: 'cta',
      name: 'CTA',
      description: 'Call-to-action sections',
      icon: '🎯',
      count: sections.filter(s => s.category === 'cta').length,
    },
    {
      id: 'pricing',
      name: 'Pricing',
      description: 'Pricing tables and comparisons',
      icon: '💰',
      count: sections.filter(s => s.category === 'pricing').length,
    },
    {
      id: 'features',
      name: 'Features',
      description: 'Product feature showcases',
      icon: '✨',
      count: sections.filter(s => s.category === 'features').length,
    },
  ];
}

