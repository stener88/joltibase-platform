#!/usr/bin/env node

/**
 * Test script for SaaS Product design system detection
 */

import { detectDesignSystem } from '../emails/lib/design-system-selector';

console.log('🧪 Testing SaaS Product Design System Detection\n');
console.log('='.repeat(80));

const testPrompts = [
  // Should trigger SaaS
  {
    prompt: 'New feature announcement - AI analytics',
    expectedSystem: 'saas-product',
    description: 'Feature announcement'
  },
  {
    prompt: 'Onboarding email for new SaaS users',
    expectedSystem: 'saas-product',
    description: 'SaaS onboarding'
  },
  {
    prompt: 'Product update - version 2.0 released with new dashboard',
    expectedSystem: 'saas-product',
    description: 'Product update/release'
  },
  {
    prompt: 'Welcome to our platform - getting started guide',
    expectedSystem: 'saas-product',
    description: 'Platform welcome/guide'
  },
  {
    prompt: 'New API integration available - developer announcement',
    expectedSystem: 'saas-product',
    description: 'API/integration announcement'
  },
  {
    prompt: 'Upgrade to Pro - unlock advanced analytics features',
    expectedSystem: 'saas-product',
    description: 'Upgrade/trial prompt'
  },
  {
    prompt: 'Tutorial: How to set up your workflow automation',
    expectedSystem: 'saas-product',
    description: 'Tutorial/workflow'
  },
  
  // Should NOT trigger SaaS (baseline tests)
  {
    prompt: 'Black Friday sale - 50% off all products',
    expectedSystem: 'ecommerce-conversion',
    description: 'E-commerce sale (should be e-commerce)'
  },
  {
    prompt: 'Weekly newsletter: Industry insights and trends',
    expectedSystem: 'newsletter-editorial',
    description: 'Newsletter (should be newsletter)'
  },
  {
    prompt: 'Quarterly business report for stakeholders',
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
  console.log('🎉 All tests passed! SaaS detection is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the keyword triggers.\n');
  process.exit(1);
}

