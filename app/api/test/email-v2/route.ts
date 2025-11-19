/**
 * Test API Route for React Email V2
 * 
 * GET /api/test/email-v2
 */

import { NextResponse } from 'next/server';
import { renderTestEmail, validateComponentTree } from '@/lib/email-v2/renderer';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';

export async function GET() {
  try {
    console.log('🧪 [TEST-EMAIL-V2] Testing React Email renderer...');
    
    // Test 1: Render test email
    const html = await renderTestEmail();
    
    console.log('✅ [TEST-EMAIL-V2] Rendered successfully');
    console.log(`📏 [TEST-EMAIL-V2] HTML size: ${html.length} characters`);
    
    // Test 2: Validate structure
    const testComponent: EmailComponent = {
      id: 'test',
      component: 'Container',
      props: {},
      children: [
        {
          id: 'text1',
          component: 'Text',
          props: {},
          content: 'Hello',
        },
      ],
    };
    
    const validation = validateComponentTree(testComponent);
    console.log(`✅ [TEST-EMAIL-V2] Validation: ${validation.valid}`);
    
    // Basic checks
    const checks = {
      hasDoctype: html.includes('<!DOCTYPE'),
      hasTables: html.includes('<table'),
      hasHeading: html.includes('Welcome to React Email V2'),
      hasButton: html.includes('Get Started'),
      hasStyles: html.includes('style='),
    };
    
    const allPassed = Object.values(checks).every(Boolean);
    
    return NextResponse.json({
      success: true,
      message: allPassed ? 'All checks passed!' : 'Some checks failed',
      checks,
      htmlLength: html.length,
      htmlPreview: html.substring(0, 500),
      validation,
    });
    
  } catch (error) {
    console.error('❌ [TEST-EMAIL-V2] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

