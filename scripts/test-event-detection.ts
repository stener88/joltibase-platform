#!/usr/bin/env node

/**
 * Test script for Event & Conference design system detection
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

console.log('🧪 Testing Event & Conference Design System Detection\n');
console.log('='.repeat(80));

const testPrompts = [
  // Should trigger Event
  {
    prompt: 'Tech conference registration - join us March 15th',
    expectedSystem: 'event-conference',
    description: 'Conference registration'
  },
  {
    prompt: 'Webinar invitation: Learn AI best practices',
    expectedSystem: 'event-conference',
    description: 'Webinar invitation'
  },
  {
    prompt: 'Save the date - Annual Summit 2025',
    expectedSystem: 'event-conference',
    description: 'Save the date announcement'
  },
  {
    prompt: 'RSVP now for our networking event',
    expectedSystem: 'event-conference',
    description: 'RSVP/networking event'
  },
  {
    prompt: 'Early bird tickets available - Developer Workshop',
    expectedSystem: 'event-conference',
    description: 'Early bird tickets'
  },
  {
    prompt: 'Meet our keynote speakers at TechConf 2025',
    expectedSystem: 'event-conference',
    description: 'Speaker announcement'
  },
  {
    prompt: 'Virtual event: Join live on Zoom next Tuesday',
    expectedSystem: 'event-conference',
    description: 'Virtual event'
  },
  {
    prompt: 'Full agenda released for the upcoming conference',
    expectedSystem: 'event-conference',
    description: 'Agenda announcement'
  },
  
  // Should NOT trigger Event (baseline tests)
  {
    prompt: 'Flash sale - 50% off everything',
    expectedSystem: 'ecommerce-conversion',
    description: 'E-commerce sale (should be e-commerce)'
  },
  {
    prompt: 'New feature: AI analytics dashboard',
    expectedSystem: 'saas-product',
    description: 'SaaS feature (should be SaaS)'
  },
  {
    prompt: 'Weekly newsletter: Industry updates',
    expectedSystem: 'newsletter-editorial',
    description: 'Newsletter (should be newsletter)'
  },
  {
    prompt: 'Q4 business review for executives',
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
  console.log('🎉 All tests passed! Event detection is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the keyword triggers.\n');
  process.exit(1);
}

