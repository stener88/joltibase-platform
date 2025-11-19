/**
 * Test Renderer V2
 * 
 * GET /api/test/renderer-v2
 * 
 * Tests the email wrapper and rendering system without AI
 */

import { NextResponse } from 'next/server';
import {
  createEmailWrapper,
  insertContentIntoWrapper,
  addPreviewToEmail,
  renderEmailComponent,
  validateComponentTree,
  type EmailComponent,
} from '@/lib/email-v2';

export async function GET() {
  console.log('\n🧪 [TEST-RENDERER-V2] Starting renderer test...\n');
  
  try {
    // Create test content (simulating what AI would generate)
    const testContent: EmailComponent[] = [
      {
        id: 'hero-section',
        component: 'Section',
        props: {
          style: {
            backgroundColor: '#7c3aed',
            padding: '60px 40px',
            textAlign: 'center',
          },
        },
        children: [
          {
            id: 'hero-title',
            component: 'Heading',
            props: {
              as: 'h1',
              style: {
                color: '#ffffff',
                fontSize: '36px',
                fontWeight: 700,
                margin: '0 0 16px 0',
              },
            },
            content: 'Welcome to React Email V2!',
          },
          {
            id: 'hero-subtitle',
            component: 'Text',
            props: {
              style: {
                color: '#e9d5ff',
                fontSize: '18px',
                margin: '0 0 32px 0',
              },
            },
            content: 'Build emails with AI using React components.',
          },
          {
            id: 'hero-cta',
            component: 'Button',
            props: {
              href: 'https://example.com/get-started',
              style: {
                backgroundColor: '#ffffff',
                color: '#7c3aed',
                padding: '14px 32px',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none',
              },
            },
            content: 'Get Started',
          },
        ],
      },
      {
        id: 'features-section',
        component: 'Section',
        props: {
          style: {
            padding: '40px',
          },
        },
        children: [
          {
            id: 'features-title',
            component: 'Heading',
            props: {
              as: 'h2',
              style: {
                color: '#111827',
                fontSize: '24px',
                fontWeight: 600,
                margin: '0 0 24px 0',
              },
            },
            content: 'Key Features',
          },
          {
            id: 'feature-1',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                margin: '0 0 12px 0',
              },
            },
            content: '✅ AI-powered email generation',
          },
          {
            id: 'feature-2',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                margin: '0 0 12px 0',
              },
            },
            content: '✅ React Email components',
          },
          {
            id: 'feature-3',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
              },
            },
            content: '✅ Type-safe and composable',
          },
        ],
      },
    ];
    
    console.log('📦 [TEST-RENDERER-V2] Created test content:', testContent.length, 'sections');
    
    // Create wrapper
    const testSettings = {
      primaryColor: '#7c3aed',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      backgroundColor: '#ffffff',
    };
    
    const wrapper = createEmailWrapper(testSettings);
    console.log('✅ [TEST-RENDERER-V2] Wrapper created');
    
    // Insert content
    let fullEmail = insertContentIntoWrapper(wrapper, testContent);
    console.log('✅ [TEST-RENDERER-V2] Content inserted');
    
    // Add preview
    fullEmail = addPreviewToEmail(fullEmail, 'Welcome to React Email V2!');
    console.log('✅ [TEST-RENDERER-V2] Preview added');
    
    // Validate structure
    const validation = validateComponentTree(fullEmail);
    console.log(`✅ [TEST-RENDERER-V2] Validation: ${validation.valid ? 'PASS' : 'FAIL'}`);
    
    if (!validation.valid) {
      console.log('❌ [TEST-RENDERER-V2] Validation errors:', validation.errors);
    }
    
    // Render to HTML
    const { html } = await renderEmailComponent(fullEmail, testSettings, { pretty: true });
    console.log('✅ [TEST-RENDERER-V2] Rendered to HTML');
    console.log(`📏 [TEST-RENDERER-V2] HTML size: ${html.length} characters`);
    
    // Checks
    const checks = {
      hasDoctype: html.includes('<!DOCTYPE'),
      hasTables: html.includes('<table'),
      hasHeroTitle: html.includes('Welcome to React Email V2'),
      hasButton: html.includes('Get Started'),
      hasFeatures: html.includes('Key Features'),
      hasPreview: html.includes('Welcome to React Email V2!'),
    };
    
    const allPassed = Object.values(checks).every(Boolean);
    
    console.log('\n🎉 [TEST-RENDERER-V2] Test complete!\n');
    
    return NextResponse.json({
      success: true,
      test: 'Renderer V2',
      results: {
        validation: validation.valid,
        validationErrors: validation.errors || [],
        checks,
        allChecksPassed: allPassed,
        htmlLength: html.length,
      },
      structure: {
        root: fullEmail.component,
        hasHead: !!fullEmail.children?.[0],
        hasBody: !!fullEmail.children?.[1],
        hasPreview: !!fullEmail.children?.[0]?.children?.length,
        contentSections: testContent.length,
      },
      htmlPreview: html.substring(0, 500),
    });
    
  } catch (error) {
    console.error('\n❌ [TEST-RENDERER-V2] Test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

