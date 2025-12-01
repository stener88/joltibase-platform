/**
 * Test e-commerce design system detection
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

const testPrompts = [
  // E-commerce prompts
  '50% off flash sale on headphones',
  'New product launch - wireless earbuds',
  'Abandoned cart reminder',
  'Black Friday sale - shop now',
  'Product recommendation based on your purchase',
  'Limited time offer - buy 2 get 1 free',
  
  // Newsletter prompts (should NOT trigger e-commerce)
  'Create a newsletter for me',
  'Weekly blog digest',
  
  // Corporate prompts (should NOT trigger e-commerce)
  'Quarterly earnings report',
  'Professional announcement',
];

console.log('🧪 Testing E-commerce Design System Detection\n');
console.log('='.repeat(70));

testPrompts.forEach((prompt, i) => {
  console.log(`\n${i + 1}. Prompt: "${prompt}"`);
  const system = detectDesignSystem(prompt);
  const emoji = system.id === 'ecommerce-conversion' ? '🛍️' : 
                system.id === 'newsletter-editorial' ? '📰' : '🏢';
  console.log(`   ${emoji} Selected: ${system.name} (${system.id})`);
});

console.log('\n' + '='.repeat(70));
console.log('\n✅ E-commerce detection test complete\n');

