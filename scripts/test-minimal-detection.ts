#!/usr/bin/env node

/**
 * Test script for Minimal Elegant design system detection
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

console.log('🧪 Testing Minimal Elegant Design System Detection\n');
console.log('='.repeat(80));

const testPrompts = [
  // Should trigger Minimal Elegant
  {
    prompt: 'Luxury fashion collection - exclusive preview',
    expectedSystem: 'minimal-elegant',
    description: 'Luxury fashion'
  },
  {
    prompt: 'Bespoke couture services for premium clientele',
    expectedSystem: 'minimal-elegant',
    description: 'Bespoke/premium service'
  },
  {
    prompt: 'Private viewing at our Madison Avenue atelier',
    expectedSystem: 'minimal-elegant',
    description: 'Private viewing/atelier'
  },
  {
    prompt: 'Elegant minimalist design showcase',
    expectedSystem: 'minimal-elegant',
    description: 'Elegant/minimalist design'
  },
  {
    prompt: 'Handcrafted fine jewelry collection',
    expectedSystem: 'minimal-elegant',
    description: 'Handcrafted/fine jewelry'
  },
  {
    prompt: 'Sophisticated art gallery exhibition opening',
    expectedSystem: 'minimal-elegant',
    description: 'Sophisticated/art gallery'
  },
  {
    prompt: 'Curated designer collection from Milan',
    expectedSystem: 'minimal-elegant',
    description: 'Curated/designer/Milan'
  },
  
  // Should NOT trigger Minimal Elegant (baseline tests)
  {
    prompt: 'Flash sale - 50% off',
    expectedSystem: 'ecommerce-conversion',
    description: 'E-commerce sale (should be e-commerce)'
  },
  {
    prompt: 'Tech conference registration',
    expectedSystem: 'event-conference',
    description: 'Conference (should be event)'
  },
  {
    prompt: 'We\'re launching our beta - join the waitlist',
    expectedSystem: 'modern-startup',
    description: 'Beta launch (should be startup)'
  },
  {
    prompt: 'New feature: AI analytics',
    expectedSystem: 'saas-product',
    description: 'SaaS feature (should be SaaS)'
  },
  {
    prompt: 'Weekly industry newsletter',
    expectedSystem: 'newsletter-editorial',
    description: 'Newsletter (should be newsletter)'
  }
];

let passCount = 0;
let failCount = 0;

testPrompts.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.description}`);
  console.log(`   Prompt: "${test.prompt}"`);
  
  const detected = detectDesignSystem(test.prompt);
  
  const passed = detected.id === test.expectedSystem;
  const status = passed ? '✅ PASS' : '❌ FAIL';
  
  console.log(`   Expected: ${test.expectedSystem}`);
  console.log(`   Detected: ${detected.id} (${detected.name})`);
  console.log(`   ${status}`);
  
  if (passed) {
    passCount++;
  } else {
    failCount++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 RESULTS: ${passCount} passed, ${failCount} failed out of ${testPrompts.length} tests`);

if (failCount === 0) {
  console.log('🎉 All tests passed! Minimal Elegant detection is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the keyword triggers.\n');
  process.exit(1);
}

