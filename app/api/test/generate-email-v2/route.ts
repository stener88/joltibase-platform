/**
 * Test API for Email Generation V2
 * 
 * GET /api/test/generate-email-v2
 * 
 * Tests the AI email generation system
 */

import { NextResponse } from 'next/server';
import { generateEmailSemantic, validateComponentTree } from '@/lib/email-v2';

export async function GET() {
  const startTime = Date.now();
  
  console.log('\n🧪 [TEST-GENERATE-V2] Starting email generation test...\n');
  
  try {
    // Test 1: Simple welcome email
    const testPrompt = 'Create a welcome email for a SaaS product with a hero section, bullet points about features, and a CTA button';
    
    const testSettings = {
      primaryColor: '#7c3aed',
      secondaryColor: '#10b981',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      backgroundColor: '#ffffff',
    };
    
    console.log('📝 [TEST-GENERATE-V2] Prompt:', testPrompt);
    console.log('⚙️  [TEST-GENERATE-V2] Settings:', testSettings);
    
    // Generate email
    const result = await generateEmailSemantic(testPrompt, testSettings);
    
    console.log('\n✅ [TEST-GENERATE-V2] Email generated!');
    console.log(`📊 [TEST-GENERATE-V2] Model: ${result.metadata.model}`);
    console.log(`⏱️  [TEST-GENERATE-V2] AI Time: ${result.metadata.timeMs}ms`);
    
    // Validate structure
    const validation = validateComponentTree(result.email);
    
    console.log(`\n🔍 [TEST-GENERATE-V2] Validation: ${validation.valid ? '✅ PASS' : '❌ FAIL'}`);
    if (!validation.valid) {
      console.log('❌ [TEST-GENERATE-V2] Errors:', validation.errors);
    }
    
    // Count components
    function countComponents(node: any): number {
      let count = 1;
      if (node.children) {
        for (const child of node.children) {
          count += countComponents(child);
        }
      }
      return count;
    }
    
    const componentCount = countComponents(result.email);
    console.log(`📦 [TEST-GENERATE-V2] Total components: ${componentCount}`);
    
    // Extract content sections
    const container = result.email.children?.[1]?.children?.[0];
    const contentSections = container?.children || [];
    console.log(`📄 [TEST-GENERATE-V2] Content sections: ${contentSections.length}`);
    
    const totalTime = Date.now() - startTime;
    console.log(`\n🎉 [TEST-GENERATE-V2] Test complete! Total time: ${totalTime}ms\n`);
    
    // Return results
    return NextResponse.json({
      success: true,
      test: 'Email Generation V2',
      results: {
        validation: validation.valid,
        validationErrors: validation.errors || [],
        componentCount,
        contentSections: contentSections.length,
        hasPreview: result.email.children?.[0]?.children?.some((c: any) => c.component === 'Preview'),
        metadata: {
          ...result.metadata,
          totalTimeMs: totalTime,
        },
      },
      email: {
        structure: {
          root: result.email.component,
          head: result.email.children?.[0]?.component,
          body: result.email.children?.[1]?.component,
          container: container?.component,
        },
        contentPreview: contentSections.slice(0, 2).map((section: any) => ({
          id: section.id,
          component: section.component,
          childCount: section.children?.length || 0,
        })),
      },
    });
    
  } catch (error) {
    console.error('\n❌ [TEST-GENERATE-V2] Test failed:', error);
    
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

