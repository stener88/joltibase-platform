#!/usr/bin/env node

/**
 * Test script for Modern Startup design system detection
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

console.log('🧪 Testing Modern Startup Design System Detection\n');
console.log('='.repeat(80));

const testPrompts = [
  // Should trigger Modern Startup
  {
    prompt: 'We\'re launching our beta - join the waitlist',
    expectedSystem: 'modern-startup',
    description: 'Beta launch/waitlist'
  },
  {
    prompt: 'Exclusive early access for indie hackers',
    expectedSystem: 'modern-startup',
    description: 'Early access/exclusive'
  },
  {
    prompt: 'Ship 10x faster with our revolutionary platform',
    expectedSystem: 'modern-startup',
    description: 'Launch with innovation language'
  },
  {
    prompt: 'We just raised $10M Series A - join our journey',
    expectedSystem: 'modern-startup',
    description: 'Funding announcement'
  },
  {
    prompt: 'Introducing our game-changing startup platform',
    expectedSystem: 'modern-startup',
    description: 'Introducing/game-changing'
  },
  {
    prompt: 'Get beta access before everyone else',
    expectedSystem: 'modern-startup',
    description: 'Beta access FOMO'
  },
  {
    prompt: 'We\'re unveiling the future of work - exclusive preview',
    expectedSystem: 'modern-startup',
    description: 'Unveiling/preview'
  },
  
  // Should NOT trigger Modern Startup (baseline tests)
  {
    prompt: 'Flash sale - 50% off all items',
    expectedSystem: 'ecommerce-conversion',
    description: 'E-commerce sale (should be e-commerce)'
  },
  {
    prompt: 'Conference registration now open',
    expectedSystem: 'event-conference',
    description: 'Conference (should be event)'
  },
  {
    prompt: 'New feature: Team collaboration dashboard',
    expectedSystem: 'saas-product',
    description: 'SaaS feature (should be SaaS)'
  },
  {
    prompt: 'Weekly industry newsletter',
    expectedSystem: 'newsletter-editorial',
    description: 'Newsletter (should be newsletter)'
  },
  {
    prompt: 'Quarterly financial report',
    expectedSystem: 'corporate-professional',
    description: 'Business report (should be corporate)'
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
  console.log('🎉 All tests passed! Modern Startup detection is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the keyword triggers.\n');
  process.exit(1);
}

