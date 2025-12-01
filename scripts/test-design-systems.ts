/**
 * Test design system selector
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

const testPrompts = [
  'Create a newsletter for me!',
  'Send quarterly earnings report to shareholders',
  'Professional corporate announcement about merger',
  'Weekly blog digest with articles',
  'Business announcement for investors',
  'Tips newsletter for subscribers',
];

console.log('🧪 Testing Design System Selector\n');
console.log('='.repeat(70));

testPrompts.forEach((prompt, i) => {
  console.log(`\n${i + 1}. Prompt: "${prompt}"`);
  const system = detectDesignSystem(prompt);
  console.log(`   Selected: ${system.name} (${system.id})`);
});

console.log('\n' + '='.repeat(70));
console.log('\n✅ Design system selector test complete\n');

