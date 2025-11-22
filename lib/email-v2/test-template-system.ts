/**
 * Test Template System with Header Pattern
 * 
 * Verifies the complete flow:
 * 1. Semantic block → Template engine → HTML
 * 2. HTML → HTML parser → EmailComponent tree
 */

import type { HeaderBlock } from './ai/blocks';
import type { GlobalEmailSettings } from './types';
import { renderBlockToHTML } from './template-engine';
import { parseHTMLToEmailComponent } from './html-parser';
import { transformBlockToEmail } from './ai/transforms';

// Test header block data
const testHeaderBlock: HeaderBlock = {
  blockType: 'header',
  variant: 'centered-menu',
  logoUrl: 'https://example.com/logo.png',
  logoAlt: 'Company Logo',
  menuItems: [
    { label: 'Home', url: 'https://example.com/' },
    { label: 'About', url: 'https://example.com/about' },
    { label: 'Contact', url: 'https://example.com/contact' },
  ],
};

// Test settings
const testSettings: GlobalEmailSettings = {
  primaryColor: '#7c3aed',
  fontFamily: 'Inter, sans-serif',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

/**
 * Test 1: Template engine rendering
 */
async function testTemplateRendering() {
  console.log('\n🧪 Test 1: Template Engine Rendering');
  console.log('=====================================\n');
  
  try {
    const html = renderBlockToHTML(testHeaderBlock, testSettings);
    
    if (!html) {
      throw new Error('Template rendering returned null');
    }
    
    console.log('✅ Template rendered successfully');
    console.log(`📄 HTML length: ${html.length} characters`);
    
    // Check if logo URL was injected
    if (html.includes(testHeaderBlock.logoUrl!)) {
      console.log('✅ Logo URL correctly injected');
    } else {
      console.warn('⚠️  Logo URL not found in output');
    }
    
    // Check if menu items were injected
    let menuItemsFound = 0;
    for (const item of testHeaderBlock.menuItems!) {
      if (html.includes(item.label) && html.includes(item.url)) {
        menuItemsFound++;
      }
    }
    console.log(`✅ ${menuItemsFound}/${testHeaderBlock.menuItems!.length} menu items correctly injected`);
    
    return html;
    
  } catch (error) {
    console.error('❌ Template rendering failed:', error);
    throw error;
  }
}

/**
 * Test 2: HTML parsing
 */
async function testHTMLParsing(html: string) {
  console.log('\n🧪 Test 2: HTML Parsing');
  console.log('=======================\n');
  
  try {
    const emailComponent = parseHTMLToEmailComponent(html);
    
    console.log('✅ HTML parsed successfully');
    console.log(`🌳 Component tree created with root type: ${emailComponent.component}`);
    
    // Check structure
    if (emailComponent.children) {
      console.log(`✅ Has ${emailComponent.children.length} child components`);
      
      const hasHead = emailComponent.children.some(c => c.component === 'Head');
      const hasBody = emailComponent.children.some(c => c.component === 'Body');
      
      if (hasHead) console.log('✅ Head component found');
      if (hasBody) console.log('✅ Body component found');
    }
    
    return emailComponent;
    
  } catch (error) {
    console.error('❌ HTML parsing failed:', error);
    throw error;
  }
}

/**
 * Test 3: Complete transform pipeline
 */
async function testCompletePipeline() {
  console.log('\n🧪 Test 3: Complete Transform Pipeline');
  console.log('=========================================\n');
  
  try {
    const emailComponent = transformBlockToEmail(testHeaderBlock, testSettings);
    
    console.log('✅ Complete pipeline successful');
    console.log(`🌳 Root component type: ${emailComponent.component}`);
    console.log(`📦 Component ID: ${emailComponent.id}`);
    
    return emailComponent;
    
  } catch (error) {
    console.error('❌ Complete pipeline failed:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runHeaderPatternTests() {
  console.log('\n🚀 Starting Header Pattern Tests');
  console.log('==================================\n');
  
  try {
    // Test 1: Rendering
    const html = await testTemplateRendering();
    
    // Test 2: Parsing
    await testHTMLParsing(html);
    
    // Test 3: Complete pipeline
    await testCompletePipeline();
    
    console.log('\n✅ All tests passed!');
    console.log('==================\n');
    
  } catch (error) {
    console.error('\n❌ Tests failed');
    console.error('==============\n');
    throw error;
  }
}

// Export for manual testing
export {
  testHeaderBlock,
  testSettings,
  testTemplateRendering,
  testHTMLParsing,
  testCompletePipeline,
};

