#!/usr/bin/env tsx
/**
 * Block System Test Runner
 * 
 * Execute comprehensive tests for Phase 4A: Block Foundation
 * 
 * Usage:
 *   npx tsx scripts/test-block-system.ts
 */

import { runAllBlockTests, generateSampleBlockEmail } from '../lib/email/blocks/test-blocks';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Test Runner
// ============================================================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Phase 4A: Block Foundation - Test Suite                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Run all tests
  const results = runAllBlockTests();
  
  // Display results
  console.log('\n' + '='.repeat(60));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  console.log(results.summary);
  console.log();
  
  // Block Rendering Tests
  console.log('📦 Block Rendering Tests:');
  console.log(`   Status: ${results.details.blockRendering.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Tested: ${results.details.blockRendering.results.length} block types`);
  
  const failedBlocks = results.details.blockRendering.results.filter((r: any) => !r.success);
  if (failedBlocks.length > 0) {
    console.log('   Failed blocks:');
    failedBlocks.forEach((block: any) => {
      console.log(`     - ${block.type}: ${block.error}`);
    });
  }
  console.log();
  
  // Complete Email Rendering
  console.log('📧 Complete Email Rendering:');
  console.log(`   Status: ${results.details.completeEmail.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   HTML Length: ${results.details.completeEmail.html?.length || 0} characters`);
  
  if (results.details.completeEmail.safety) {
    console.log(`   Email Safety: ${results.details.completeEmail.safety.safe ? '✅ SAFE' : '⚠️  ISSUES'}`);
    if (results.details.completeEmail.safety.issues.length > 0) {
      console.log('   Issues:');
      results.details.completeEmail.safety.issues.forEach((issue: string) => {
        console.log(`     - ${issue}`);
      });
    }
  }
  console.log();
  
  // Migration Tests
  console.log('🔄 Migration Tests:');
  console.log(`   Status: ${results.details.migration.success ? '✅ PASS' : '❌ FAIL'}`);
  results.details.migration.results.forEach((result: any) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`   ${icon} ${result.test}${result.error ? `: ${result.error}` : ''}`);
  });
  console.log();
  
  // Overall Result
  console.log('='.repeat(60));
  if (results.success) {
    console.log('🎉 ALL TESTS PASSED! Block system is ready.');
  } else {
    console.log('❌ SOME TESTS FAILED. Review errors above.');
  }
  console.log('='.repeat(60) + '\n');
  
  // Generate sample email for visual inspection
  if (results.success) {
    console.log('📝 Generating sample email for visual inspection...');
    try {
      const sampleHtml = generateSampleBlockEmail();
      const outputPath = path.join(process.cwd(), 'test-output-block-email.html');
      fs.writeFileSync(outputPath, sampleHtml);
      console.log(`✅ Sample email saved to: ${outputPath}`);
      console.log('   Open in browser to visually inspect the email.\n');
    } catch (error: any) {
      console.error(`❌ Failed to generate sample: ${error.message}\n`);
    }
  }
  
  // Exit with appropriate code
  process.exit(results.success ? 0 : 1);
}

// ============================================================================
// Execute
// ============================================================================

main().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});

