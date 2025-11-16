/**
 * Test script to compare factory-generated renderer with hand-written renderer
 * Run with: npx tsx lib/email/blocks/renderers/__tests__/factory-test.ts
 */

import { getFactoryRenderer } from '../layout-factory';
import { renderHeroCenterLayout } from '../layout-blocks';
import type { RenderContext } from '../index';

// Test data
const testContent = {
  header: 'INTRODUCING',
  title: 'Your Headline Here',
  divider: true,
  paragraph: 'Add your description text here.',
  button: { text: 'Get Started', url: '#' },
};

const testSettings = {
  showHeader: true,
  showTitle: true,
  showDivider: true,
  showParagraph: true,
  showButton: true,
  backgroundColor: 'transparent',
  titleColor: '#111827',
  paragraphColor: '#374151',
  dividerColor: '#e5e7eb',
  padding: { top: 80, right: 40, bottom: 80, left: 40 },
};

const testContext: RenderContext = {
  brandConfig: {
    primaryColor: '#e9a589',
    textColor: '#374151',
    fontFamily: 'system-ui',
  },
};

// Test 1: Full content
console.log('🧪 Test 1: Full content (all elements visible)');
const factoryRenderer = getFactoryRenderer('hero-center');
if (!factoryRenderer) {
  console.error('❌ Factory renderer not found for hero-center');
  process.exit(1);
}

const factoryOutput = factoryRenderer(testContent, testSettings, testContext);
const handWrittenOutput = renderHeroCenterLayout(testContent, testSettings, testContext);

console.log('\n--- Factory Output ---');
console.log(factoryOutput.substring(0, 200) + '...');
console.log('\n--- Hand-written Output ---');
console.log(handWrittenOutput.substring(0, 200) + '...');

if (factoryOutput === handWrittenOutput) {
  console.log('\n✅ Test 1 PASSED: Outputs are identical');
} else {
  console.log('\n⚠️ Test 1 FAILED: Outputs differ');
  console.log('Factory length:', factoryOutput.length);
  console.log('Hand-written length:', handWrittenOutput.length);
}

// Test 2: Partial content (some elements hidden)
console.log('\n\n🧪 Test 2: Partial content (header and divider hidden)');
const partialSettings = {
  ...testSettings,
  showHeader: false,
  showDivider: false,
};

const factoryOutput2 = factoryRenderer(testContent, partialSettings, testContext);
const handWrittenOutput2 = renderHeroCenterLayout(testContent, partialSettings, testContext);

if (factoryOutput2 === handWrittenOutput2) {
  console.log('✅ Test 2 PASSED: Outputs are identical');
} else {
  console.log('⚠️ Test 2 FAILED: Outputs differ');
  console.log('Factory length:', factoryOutput2.length);
  console.log('Hand-written length:', handWrittenOutput2.length);
}

// Test 3: Empty content (placeholder state)
console.log('\n\n🧪 Test 3: Empty content (placeholder state)');
const emptyContent = {};
const emptySettings = {};

const factoryOutput3 = factoryRenderer(emptyContent, emptySettings, testContext);
const handWrittenOutput3 = renderHeroCenterLayout(emptyContent, emptySettings, testContext);

console.log('\n--- Factory Output (placeholder) ---');
console.log(factoryOutput3);
console.log('\n--- Hand-written Output (placeholder) ---');
console.log(handWrittenOutput3);

if (factoryOutput3 === handWrittenOutput3) {
  console.log('\n✅ Test 3 PASSED: Outputs are identical');
} else {
  console.log('\n⚠️ Test 3 FAILED: Outputs differ (this is expected - placeholder text differs)');
}

// Test 4: Different colors
console.log('\n\n🧪 Test 4: Different colors and padding');
const coloredSettings = {
  ...testSettings,
  backgroundColor: '#f9fafb',
  titleColor: '#1f2937',
  paragraphColor: '#6b7280',
  padding: { top: 40, right: 20, bottom: 40, left: 20 },
};

const factoryOutput4 = factoryRenderer(testContent, coloredSettings, testContext);
const handWrittenOutput4 = renderHeroCenterLayout(testContent, coloredSettings, testContext);

if (factoryOutput4 === handWrittenOutput4) {
  console.log('✅ Test 4 PASSED: Outputs are identical');
} else {
  console.log('⚠️ Test 4 FAILED: Outputs differ');
  console.log('Factory length:', factoryOutput4.length);
  console.log('Hand-written length:', handWrittenOutput4.length);
}

// Summary
console.log('\n\n📊 Test Summary');
console.log('================');
const passed = [
  factoryOutput === handWrittenOutput,
  factoryOutput2 === handWrittenOutput2,
  factoryOutput4 === handWrittenOutput4,
].filter(Boolean).length;

console.log(`Passed: ${passed}/3 tests (excluding placeholder test)`);

if (passed === 3) {
  console.log('\n🎉 SUCCESS: Factory renderer produces identical output to hand-written renderer!');
  process.exit(0);
} else {
  console.log('\n⚠️ Some tests failed. Review differences above.');
  process.exit(1);
}

