/**
 * Block System Test Suite
 * 
 * Tests all block types for:
 * - Email-safe HTML rendering
 * - Migration utilities (section ↔ block)
 * - Block validation
 * - Complete email rendering
 */

import type { EmailContent } from '../templates/types';
import type { EmailBlock, GlobalEmailSettings } from './types';
import { createDefaultBlock } from './registry';
import { validateBlock, validateBlocks } from './schemas';
import { renderBlock, renderBlocksToEmail } from './renderer';
import { contentToBlocks, blocksToContent, testContentRoundTrip } from './migration';

// ============================================================================
// Test Configuration
// ============================================================================

const TEST_GLOBAL_SETTINGS: GlobalEmailSettings = {
  backgroundColor: '#f3f4f6',
  contentBackgroundColor: '#ffffff',
  maxWidth: 600,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  mobileBreakpoint: 480,
};

const TEST_MERGE_TAGS = {
  first_name: 'John',
  company_name: 'Test Company',
  cta_url: 'https://example.com',
  unsubscribe_url: 'https://example.com/unsubscribe',
  preferences_url: 'https://example.com/preferences',
};

// ============================================================================
// Block Rendering Tests
// ============================================================================

/**
 * Test 1: Create and render all 14 block types
 */
export function testAllBlockTypes(): { success: boolean; results: any[] } {
  const blockTypes = [
    'logo', 'spacer', 'heading', 'text', 'image', 'button', 'divider',
    'hero', 'stats', 'testimonial', 'feature-grid', 'comparison',
    'social-links', 'footer'
  ] as const;
  
  const results = blockTypes.map((type, index) => {
    try {
      // Create default block
      const block = createDefaultBlock(type, index);
      
      // Validate block
      const validation = validateBlock(block);
      if (!validation.success) {
        return {
          type,
          success: false,
          error: `Validation failed: ${validation.error?.message || 'Unknown error'}`,
        };
      }
      
      // Render block
      const html = renderBlock(block, {
        globalSettings: TEST_GLOBAL_SETTINGS,
        mergeTags: TEST_MERGE_TAGS,
      });
      
      // Verify HTML is not empty and contains table tags (email-safe)
      const hasTable = html.includes('<table');
      const hasContent = html.length > 50;
      
      return {
        type,
        success: hasTable && hasContent,
        htmlLength: html.length,
        hasTable,
        preview: html.substring(0, 100) + '...',
      };
    } catch (error: any) {
      return {
        type,
        success: false,
        error: error.message,
      };
    }
  });
  
  const allSuccess = results.every(r => r.success);
  
  return {
    success: allSuccess,
    results,
  };
}

/**
 * Test 2: Render complete email with multiple blocks
 */
export function testCompleteEmailRendering(): { success: boolean; html: string; error?: string } {
  try {
    // Create a realistic email with various blocks
    const blocks: EmailBlock[] = [
      createDefaultBlock('logo', 0),
      createDefaultBlock('spacer', 1),
      createDefaultBlock('hero', 2),
      createDefaultBlock('text', 3),
      createDefaultBlock('feature-grid', 4),
      createDefaultBlock('stats', 5),
      createDefaultBlock('testimonial', 6),
      createDefaultBlock('button', 7),
      createDefaultBlock('divider', 8),
      createDefaultBlock('footer', 9),
    ];
    
    // Validate all blocks
    const validation = validateBlocks(blocks);
    if (!validation.success) {
      return {
        success: false,
        html: '',
        error: `Block validation failed: ${validation.error}`,
      };
    }
    
    // Render complete email
    const html = renderBlocksToEmail(blocks, TEST_GLOBAL_SETTINGS, TEST_MERGE_TAGS);
    
    // Validate HTML structure
    const hasDoctype = html.includes('<!DOCTYPE html>');
    const hasHtmlTag = html.includes('<html');
    const hasBody = html.includes('<body');
    const hasTables = html.includes('<table');
    const isLongEnough = html.length > 1000;
    
    const success = hasDoctype && hasHtmlTag && hasBody && hasTables && isLongEnough;
    
    return {
      success,
      html,
      error: success ? undefined : 'HTML structure validation failed',
    };
  } catch (error: any) {
    return {
      success: false,
      html: '',
      error: error.message,
    };
  }
}

/**
 * Test 3: Email-safe HTML validation
 */
export function testEmailSafeHTML(html: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for unsafe elements
  const unsafeElements = ['<script', '<style', '<iframe', '<form', '<input'];
  unsafeElements.forEach(element => {
    if (html.toLowerCase().includes(element)) {
      issues.push(`Contains unsafe element: ${element}`);
    }
  });
  
  // Check for required email-safe patterns
  if (!html.includes('role="presentation"')) {
    issues.push('Missing role="presentation" on tables');
  }
  
  if (!html.includes('cellpadding="0"') || !html.includes('cellspacing="0"')) {
    issues.push('Missing cellpadding/cellspacing attributes');
  }
  
  // Check for inline styles (required for email)
  const styleCount = (html.match(/style="/g) || []).length;
  if (styleCount < 5) {
    issues.push('Insufficient inline styles (email clients require inline CSS)');
  }
  
  // Check for max-width constraint
  if (!html.includes('max-width') && !html.includes('width="600"')) {
    issues.push('Missing max-width constraint for email body');
  }
  
  return {
    safe: issues.length === 0,
    issues,
  };
}

// ============================================================================
// Migration Tests
// ============================================================================

/**
 * Test 4: Section to Block migration
 */
export function testSectionToBlockMigration(): { success: boolean; results: any[] } {
  // Sample EmailContent (section-based)
  const sampleContent: EmailContent = {
    headline: 'Welcome to Our Platform',
    subheadline: 'Get started with amazing features',
    sections: [
      { type: 'text', content: 'Thanks for signing up!' },
      { type: 'heading', content: 'Features' },
      { type: 'list', items: ['Feature 1', 'Feature 2', 'Feature 3'] },
      { type: 'divider' },
      {
        type: 'stats',
        stats: [
          { value: '10K+', label: 'Users' },
          { value: '99%', label: 'Uptime' },
        ],
      },
      {
        type: 'testimonial',
        testimonial: {
          quote: 'Great product!',
          author: 'Jane Doe',
          role: 'CEO',
        },
      },
      { type: 'spacer', size: 'medium' },
    ],
    cta: {
      text: 'Get Started',
      url: 'https://example.com',
    },
    footer: {
      companyName: 'Test Company',
      companyAddress: '123 Main St',
    },
  };
  
  const results = [];
  
  try {
    // Convert to blocks
    const blocks = contentToBlocks(sampleContent);
    
    results.push({
      test: 'contentToBlocks',
      success: blocks.length > 0,
      blockCount: blocks.length,
      blockTypes: blocks.map(b => b.type),
    });
    
    // Validate converted blocks
    const validation = validateBlocks(blocks);
    results.push({
      test: 'validateConvertedBlocks',
      success: validation.success,
      errors: validation.success ? [] : [validation.error?.toString() || 'Unknown error'],
    });
    
    // Convert back to content
    const convertedContent = blocksToContent(blocks);
    results.push({
      test: 'blocksToContent',
      success: !!convertedContent.headline && !!convertedContent.sections,
      sectionCount: convertedContent.sections?.length || 0,
    });
    
    // Test round-trip
    const roundTripSuccess = testContentRoundTrip(sampleContent);
    results.push({
      test: 'roundTrip',
      success: roundTripSuccess,
    });
    
  } catch (error: any) {
    results.push({
      test: 'migration',
      success: false,
      error: error.message,
    });
  }
  
  const allSuccess = results.every(r => r.success);
  
  return {
    success: allSuccess,
    results,
  };
}

// ============================================================================
// Comprehensive Test Runner
// ============================================================================

/**
 * Run all block system tests
 */
export function runAllBlockTests(): {
  success: boolean;
  summary: string;
  details: any;
} {
  console.log('🧪 Running Block System Tests...\n');
  
  const results = {
    blockRendering: testAllBlockTypes(),
    completeEmail: testCompleteEmailRendering(),
    migration: testSectionToBlockMigration(),
  };
  
  // Test email safety
  if (results.completeEmail.success) {
    results.completeEmail = {
      ...results.completeEmail,
      safety: testEmailSafeHTML(results.completeEmail.html),
    };
  }
  
  // Calculate overall success
  const allSuccess =
    results.blockRendering.success &&
    results.completeEmail.success &&
    results.migration.success &&
    (results.completeEmail as any).safety?.safe;
  
  // Generate summary
  const summary = allSuccess
    ? '✅ All block system tests passed!'
    : '❌ Some tests failed. See details below.';
  
  return {
    success: allSuccess,
    summary,
    details: results,
  };
}

// ============================================================================
// Sample Email Generator (for manual testing)
// ============================================================================

/**
 * Generate a sample block-based email for visual inspection
 */
export function generateSampleBlockEmail(): string {
  const blocks: EmailBlock[] = [
    // Logo
    createDefaultBlock('logo', 0),
    
    // Spacer
    createDefaultBlock('spacer', 1),
    
    // Hero
    {
      ...createDefaultBlock('hero', 2),
      content: {
        headline: 'Introducing AI-Powered Email',
        subheadline: 'Create beautiful emails in seconds with our revolutionary platform',
      },
    },
    
    // Text
    {
      ...createDefaultBlock('text', 3),
      content: {
        text: 'Our new AI email generator analyzes your content and automatically creates stunning, on-brand emails that convert.',
      },
    },
    
    // Feature Grid
    {
      ...createDefaultBlock('feature-grid', 4),
      content: {
        features: [
          { icon: '🎨', title: 'Beautiful Design', description: 'Flodesk-quality templates' },
          { icon: '⚡', title: 'Lightning Fast', description: 'Generate in seconds' },
          { icon: '📊', title: 'Data-Driven', description: 'Optimized for conversions' },
        ],
      },
    },
    
    // Stats
    {
      ...createDefaultBlock('stats', 5),
      content: {
        stats: [
          { value: '10,000+', label: 'Happy Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '50%', label: 'Higher Open Rates' },
        ],
      },
    },
    
    // Testimonial
    {
      ...createDefaultBlock('testimonial', 6),
      content: {
        quote: 'This platform transformed how we do email marketing. Our engagement is through the roof!',
        author: 'Sarah Johnson',
        role: 'Marketing Director',
        company: 'TechCorp',
      },
    },
    
    // Comparison
    {
      ...createDefaultBlock('comparison', 7),
      content: {
        before: {
          text: 'Hours spent on email design, inconsistent branding, low engagement',
        },
        after: {
          text: 'Beautiful emails in seconds, perfect branding, 2x engagement',
        },
      },
    },
    
    // Button
    {
      ...createDefaultBlock('button', 8),
      content: {
        text: 'Start Free Trial',
        url: 'https://example.com/signup',
      },
    },
    
    // Divider
    createDefaultBlock('divider', 9),
    
    // Social Links
    {
      ...createDefaultBlock('social-links', 10),
      content: {
        links: [
          { platform: 'twitter' as const, url: 'https://twitter.com/example' },
          { platform: 'linkedin' as const, url: 'https://linkedin.com/company/example' },
          { platform: 'instagram' as const, url: 'https://instagram.com/example' },
        ],
      },
    },
    
    // Footer
    {
      ...createDefaultBlock('footer', 11),
      content: {
        companyName: 'Example Inc.',
        companyAddress: '123 Innovation Drive, San Francisco, CA 94105',
        customText: 'Questions? Just reply to this email.',
        unsubscribeUrl: '{{unsubscribe_url}}',
        preferencesUrl: '{{preferences_url}}',
      },
    },
  ];
  
  return renderBlocksToEmail(blocks, TEST_GLOBAL_SETTINGS, TEST_MERGE_TAGS);
}

// ============================================================================
// Export for testing
// ============================================================================

export const testUtils = {
  runAllTests: runAllBlockTests,
  testBlockRendering: testAllBlockTypes,
  testEmailRendering: testCompleteEmailRendering,
  testMigration: testSectionToBlockMigration,
  testEmailSafety: testEmailSafeHTML,
  generateSample: generateSampleBlockEmail,
};

