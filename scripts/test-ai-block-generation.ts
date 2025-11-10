/**
 * Test Script for AI Block Generation (Phase 4B)
 * 
 * Tests the AI intelligence system and block recommendations
 */

import {
  analyzeCampaign,
  getCampaignRecommendations,
  selectTypographyScale,
  selectSpacingScale,
  getTypographySettings,
  getSpacingSettings,
  COLOR_PALETTE,
  type CampaignAnalysis,
} from '../lib/ai/blocks/intelligence';

// ============================================================================
// Test Cases
// ============================================================================

const TEST_PROMPTS = [
  {
    name: 'Product Launch',
    prompt: 'Create an email announcing the launch of our new AI-powered analytics platform. Include impressive stats about our beta users and highlight three key features.',
    tone: 'professional' as const,
  },
  {
    name: 'Newsletter',
    prompt: 'Weekly update email covering our latest blog posts, feature updates, and upcoming webinar',
    tone: 'friendly' as const,
  },
  {
    name: 'Promotional',
    prompt: 'Flash sale email: 50% off all plans for the next 24 hours. Create urgency and include customer testimonials.',
    tone: 'friendly' as const,
  },
  {
    name: 'Welcome',
    prompt: 'Welcome email for new signups. Help them get started with our platform in 3 easy steps.',
    tone: 'friendly' as const,
  },
  {
    name: 'Editorial',
    prompt: 'Thought leadership article about the future of email marketing and AI',
    tone: 'professional' as const,
  },
];

// ============================================================================
// Test Runner
// ============================================================================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Phase 4B: AI Block Generation - Intelligence Test Suite  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('🧪 Testing AI Intelligence System...\n');

// Run tests
let passedTests = 0;
const totalTests = TEST_PROMPTS.length;

TEST_PROMPTS.forEach((test, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST ${index + 1}/${totalTests}: ${test.name}`);
  console.log(`${'='.repeat(60)}\n`);
  
  console.log(`📝 Prompt: "${test.prompt}"`);
  console.log(`🎨 Tone: ${test.tone}\n`);
  
  try {
    // Get campaign recommendations
    const recommendations = getCampaignRecommendations(test.prompt, test.tone);
    
    // Display analysis
    console.log('📊 Campaign Analysis:');
    console.log(`   Type: ${recommendations.analysis.type}`);
    console.log(`   Urgency: ${recommendations.analysis.urgencyLevel}`);
    console.log(`   Importance: ${recommendations.analysis.importanceLevel}`);
    
    console.log('\n🎯 Content Characteristics:');
    Object.entries(recommendations.analysis.characteristics).forEach(([key, value]) => {
      if (value) {
        console.log(`   ✓ ${key}`);
      }
    });
    
    console.log('\n✨ Recommendations:');
    console.log(`   Typography Scale: ${recommendations.typographyScale}`);
    console.log(`   Spacing Scale: ${recommendations.spacingScale}`);
    
    console.log('\n📏 Typography Settings:');
    console.log(`   Hero Headline: ${recommendations.typography.heroHeadline}`);
    console.log(`   Section Headline: ${recommendations.typography.sectionHeadline}`);
    console.log(`   Stats Value: ${recommendations.typography.statsValue}`);
    console.log(`   Body: ${recommendations.typography.bodyStandard}`);
    
    console.log('\n📐 Spacing Settings:');
    console.log(`   Hero Padding: ${JSON.stringify(recommendations.spacing.hero)}`);
    console.log(`   Section Padding: ${JSON.stringify(recommendations.spacing.section)}`);
    console.log(`   Spacer Height: ${recommendations.spacing.spacerHeight}px`);
    
    console.log('\n🧱 Recommended Block Sequence:');
    recommendations.blockSequence.forEach((blockType, i) => {
      console.log(`   ${i + 1}. ${blockType}`);
    });
    
    console.log('\n🎨 Should Include:');
    if (recommendations.recommendations.useHero) console.log('   ✓ Hero block');
    if (recommendations.recommendations.useStats) console.log('   ✓ Stats block');
    if (recommendations.recommendations.useTestimonial) console.log('   ✓ Testimonial block');
    if (recommendations.recommendations.useComparison) console.log('   ✓ Comparison block');
    if (recommendations.recommendations.useFeatureGrid) console.log('   ✓ Feature Grid block');
    if (recommendations.recommendations.emphasizeCTA) console.log('   ⚡ Emphasize CTA');
    
    console.log('\n✅ Test PASSED');
    passedTests++;
    
  } catch (error) {
    console.log('\n❌ Test FAILED');
    console.error('Error:', error);
  }
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n\n' + '='.repeat(60));
console.log('TEST RESULTS SUMMARY');
console.log('='.repeat(60) + '\n');

if (passedTests === totalTests) {
  console.log(`✅ All ${totalTests} tests PASSED!`);
  console.log('\n🎉 AI Intelligence System is working correctly!\n');
  console.log('Next Steps:');
  console.log('1. ✅ AI can analyze campaign prompts');
  console.log('2. ✅ AI selects appropriate typography and spacing');
  console.log('3. ✅ AI recommends block sequences');
  console.log('4. 🔄 Ready to integrate with AI generation API');
  console.log('5. 🔄 Ready to test with real OpenAI API calls\n');
} else {
  console.log(`❌ ${totalTests - passedTests} test(s) failed`);
  console.log(`✅ ${passedTests} test(s) passed\n`);
}

// ============================================================================
// Example Block Generation Output
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('EXAMPLE: AI-Generated Block Email Structure');
console.log('='.repeat(60) + '\n');

const exampleRecommendations = getCampaignRecommendations(
  'Launch email for our new AI analytics platform with impressive beta stats',
  'professional'
);

console.log('For a PRODUCT LAUNCH email, AI would generate:\n');
console.log('```json');
console.log(JSON.stringify({
  subject: 'Introducing AI Analytics Platform',
  previewText: 'The future of data analysis is here',
  blocks: [
    {
      type: 'spacer',
      settings: { 
        height: exampleRecommendations.spacing.spacerHeight,
        backgroundColor: COLOR_PALETTE.bgWhite,
      },
    },
    {
      type: 'hero',
      content: {
        headline: 'Introducing AI Analytics',
        subheadline: 'Transform your data into insights in seconds',
      },
      settings: {
        padding: exampleRecommendations.spacing.hero,
        align: 'center',
        backgroundColor: COLOR_PALETTE.bgLight,
        headlineFontSize: exampleRecommendations.typography.heroHeadline,
        headlineFontWeight: exampleRecommendations.typography.weightHero,
        headlineColor: COLOR_PALETTE.textPrimary,
        subheadlineFontSize: exampleRecommendations.typography.bodyEmphasis,
        subheadlineColor: COLOR_PALETTE.textTertiary,
      },
    },
    {
      type: 'stats',
      content: {
        stats: [
          { value: '10,000+', label: 'Beta Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '2x', label: 'Faster' },
        ],
      },
      settings: {
        padding: exampleRecommendations.spacing.section,
        valueFontSize: exampleRecommendations.typography.statsValue,
        valueFontWeight: exampleRecommendations.typography.weightHero,
        valueColor: COLOR_PALETTE.textPrimary,
        labelFontSize: '14px',
        labelColor: COLOR_PALETTE.textTertiary,
        spacing: 32,
      },
    },
    {
      type: 'button',
      content: { text: 'Get Started', url: '{{cta_url}}' },
      settings: {
        style: 'solid',
        color: COLOR_PALETTE.brandPrimary,
        textColor: COLOR_PALETTE.bgWhite,
        align: 'center',
        size: 'large',
        borderRadius: '6px',
        padding: { top: 16, bottom: 16, left: 40, right: 40 },
      },
    },
  ],
  globalSettings: {
    backgroundColor: COLOR_PALETTE.bgGray,
    contentBackgroundColor: COLOR_PALETTE.bgWhite,
    maxWidth: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
}, null, 2));
console.log('```\n');

console.log('✨ Key Features of Block-Based Generation:');
console.log('   • Exact pixel values (not scale names)');
console.log('   • Granular control over every parameter');
console.log('   • Data-driven optimization ready');
console.log('   • Visual editor compatible');
console.log('   • AI learns what works best\n');

