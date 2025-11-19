/**
 * Test script for React Email V2 renderer
 * 
 * Run with: npx ts-node scripts/test-email-v2.ts
 */

import { renderTestEmail } from '../lib/email-v2/renderer';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🧪 Testing React Email V2 Renderer...\n');
  
  try {
    // Render test email
    console.log('📧 Rendering test email...');
    const html = await renderTestEmail();
    
    // Save to file for inspection
    const outputPath = path.join(__dirname, '../test-email-output.html');
    fs.writeFileSync(outputPath, html, 'utf-8');
    
    console.log('✅ Email rendered successfully!');
    console.log(`📄 Output saved to: ${outputPath}`);
    console.log(`📏 HTML size: ${html.length} characters`);
    console.log('\n--- Preview (first 500 chars) ---');
    console.log(html.substring(0, 500) + '...\n');
    
    // Basic validation
    const checks = [
      { name: 'Contains DOCTYPE', test: html.includes('<!DOCTYPE') },
      { name: 'Contains table tags', test: html.includes('<table') },
      { name: 'Contains heading', test: html.includes('Welcome to React Email V2') },
      { name: 'Contains button', test: html.includes('Get Started') },
      { name: 'Contains styles', test: html.includes('style=') },
    ];
    
    console.log('🔍 Validation Checks:');
    checks.forEach(check => {
      console.log(`  ${check.test ? '✅' : '❌'} ${check.name}`);
    });
    
    const allPassed = checks.every(c => c.test);
    if (allPassed) {
      console.log('\n🎉 All checks passed! React Email V2 is working correctly.');
    } else {
      console.log('\n⚠️  Some checks failed. Review the output.');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  }
}

main();

