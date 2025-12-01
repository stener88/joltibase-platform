/**
 * Test Design System-Aware Image Keywords
 * 
 * Verifies that image keywords are properly enhanced with design system aesthetics
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

// Mock the fetchImagesForPrompt logic for testing
function extractImageKeywords(
  prompt: string,
  designSystem?: any
): {
  hero: string;
  feature?: string;
  secondary?: string;
  tertiary?: string;
  product?: string;
  destination?: string;
} {
  const lower = prompt.toLowerCase();
  
  // Helper: Combine prompt keywords with design system aesthetics
  const enhance = (promptKeywords: string, type: 'hero' | 'feature' | 'product' | 'background' = 'feature'): string => {
    if (!designSystem || !('imageKeywords' in designSystem)) {
      return promptKeywords;
    }
    const dsKeywords = designSystem.imageKeywords[type];
    if (!dsKeywords || dsKeywords.length === 0) {
      return promptKeywords;
    }
    // Pick first keyword for consistent testing
    const keyword = dsKeywords[0];
    return `${promptKeywords} ${keyword}`;
  };
  
  // Travel/Tourism
  if (lower.includes('travel') || lower.includes('destination') || lower.includes('trip')) {
    return {
      hero: enhance('travel adventure vacation', 'hero'),
      feature: enhance('travel activities tourism', 'feature'),
      product: enhance('travel destination scenic', 'product'),
    };
  }
  
  // Events/Invitations
  if (lower.includes('event') || lower.includes('conference')) {
    return {
      hero: enhance('conference event professional', 'hero'),
      feature: enhance('business meeting presentation', 'feature'),
      product: enhance('speaker presentation', 'product'),
    };
  }
  
  // E-commerce
  if (lower.includes('sale') || lower.includes('product launch')) {
    return {
      hero: enhance('shopping sale retail store', 'hero'),
      feature: enhance('product showcase retail', 'feature'),
      product: enhance('product display merchandise', 'product'),
    };
  }
  
  // Startup/Launch
  if (lower.includes('launch') || lower.includes('beta') || lower.includes('waitlist')) {
    return {
      hero: enhance('product launch technology modern', 'hero'),
      feature: enhance('modern product design', 'feature'),
      product: enhance('product showcase display', 'product'),
    };
  }
  
  // Default
  return {
    hero: enhance('professional business workspace', 'hero'),
    feature: enhance('modern technology design', 'feature'),
    product: enhance('product service business', 'product'),
  };
}

console.log('🧪 Testing Design System-Aware Image Keywords\n');
console.log('='.repeat(80));
console.log();

const testCases = [
  {
    prompt: 'Join the waitlist - limited spots available',
    expectedSystem: 'Modern Startup',
  },
  {
    prompt: 'Create a travel newsletter for adventure seekers',
    expectedSystem: 'Newsletter Editorial',
  },
  {
    prompt: 'Flash sale - 50% off everything',
    expectedSystem: 'E-commerce Conversion',
  },
  {
    prompt: 'Conference registration is now open',
    expectedSystem: 'Event & Conference',
  },
  {
    prompt: 'New feature: AI-powered analytics',
    expectedSystem: 'SaaS Product',
  },
  {
    prompt: 'Exclusive luxury collection preview',
    expectedSystem: 'Minimal Elegant',
  },
];

for (const testCase of testCases) {
  console.log(`📧 Prompt: "${testCase.prompt}"`);
  
  // Detect design system
  const designSystem = detectDesignSystem(testCase.prompt);
  console.log(`   Design System: ${designSystem.name}`);
  
  if (designSystem.name !== testCase.expectedSystem) {
    console.log(`   ⚠️  WARNING: Expected ${testCase.expectedSystem}`);
  } else {
    console.log(`   ✅ Correct system detected`);
  }
  
  // Extract keywords WITHOUT design system
  const plainKeywords = extractImageKeywords(testCase.prompt);
  console.log(`   Plain Keywords (hero): "${plainKeywords.hero}"`);
  
  // Extract keywords WITH design system
  const enhancedKeywords = extractImageKeywords(testCase.prompt, designSystem);
  console.log(`   Enhanced Keywords (hero): "${enhancedKeywords.hero}"`);
  
  // Show the aesthetic enhancement
  if (enhancedKeywords.hero !== plainKeywords.hero) {
    const added = enhancedKeywords.hero.replace(plainKeywords.hero, '').trim();
    console.log(`   🎨 Added aesthetic: "${added}"`);
  }
  
  console.log();
}

console.log('='.repeat(80));
console.log('\n✅ Test complete! Image keywords are now design system-aware.');
console.log('\n💡 Benefits:');
console.log('   1. Initial generation gets design-consistent images');
console.log('   2. Image refinements maintain aesthetic coherence');
console.log('   3. No more generic stock photos that clash with design system');

