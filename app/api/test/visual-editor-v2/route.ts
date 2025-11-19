/**
 * Visual Editor Test API
 * 
 * GET /api/test/visual-editor-v2
 * 
 * Tests all Week 3 functionality:
 * - Component tree traversal
 * - Component selection and updates
 * - Tree manipulation (move, duplicate, delete)
 * - Rendering with selection
 */

import { NextResponse } from 'next/server';
import {
  findComponentById,
  findComponentByPath,
  getComponentPath,
  updateComponentById,
  deleteComponentById,
  moveComponent,
  duplicateComponent,
  getBreadcrumbs,
  getTreeStats,
  renderEmailComponent,
  type EmailComponent,
  type GlobalEmailSettings,
} from '@/lib/email-v2';

export async function GET() {
  const startTime = Date.now();
  const results: any = {
    tests: {},
    success: true,
  };

  try {
    console.log('🧪 [VISUAL-EDITOR-TEST] Starting tests...');

    // Sample email component tree
    const sampleRoot: EmailComponent = {
      id: 'root',
      component: 'Container',
      props: {
        style: { maxWidth: '600px', backgroundColor: '#ffffff' },
      },
      children: [
        {
          id: 'section-1',
          component: 'Section',
          props: {
            style: { padding: '20px', backgroundColor: '#f0f9ff' },
          },
          children: [
            {
              id: 'heading-1',
              component: 'Heading',
              props: {
                as: 'h1',
                style: { color: '#111827', fontSize: '32px' },
              },
              content: 'Test Heading',
            },
            {
              id: 'text-1',
              component: 'Text',
              props: {
                style: { color: '#374151', fontSize: '16px' },
              },
              content: 'Test paragraph text',
            },
          ],
        },
        {
          id: 'section-2',
          component: 'Section',
          props: {
            style: { padding: '20px' },
          },
          children: [
            {
              id: 'button-1',
              component: 'Button',
              props: {
                href: 'https://example.com',
                style: { backgroundColor: '#7c3aed', color: '#ffffff' },
              },
              content: 'Click Me',
            },
          ],
        },
      ],
    };

    // Test 1: Find component by ID
    console.log('🧪 Test 1: Find component by ID');
    const foundById = findComponentById(sampleRoot, 'heading-1');
    results.tests.findById = {
      passed: foundById?.id === 'heading-1' && foundById?.component === 'Heading',
      found: foundById ? { id: foundById.id, component: foundById.component } : null,
    };

    // Test 2: Find component by path
    console.log('🧪 Test 2: Find component by path');
    const foundByPath = findComponentByPath(sampleRoot, 'root.children[0].children[0]');
    results.tests.findByPath = {
      passed: foundByPath?.id === 'heading-1',
      found: foundByPath ? { id: foundByPath.id, component: foundByPath.component } : null,
    };

    // Test 3: Get component path
    console.log('🧪 Test 3: Get component path');
    const path = getComponentPath(sampleRoot, 'button-1');
    results.tests.getPath = {
      passed: path === 'root.children[1].children[0]',
      path,
    };

    // Test 4: Update component
    console.log('🧪 Test 4: Update component');
    const updated = updateComponentById(sampleRoot, 'heading-1', {
      content: 'Updated Heading',
      props: {
        ...foundById!.props,
        style: { ...foundById!.props!.style, color: '#7c3aed' },
      },
    });
    const updatedComponent = findComponentById(updated, 'heading-1');
    results.tests.updateComponent = {
      passed: updatedComponent?.content === 'Updated Heading' &&
        updatedComponent?.props?.style?.color === '#7c3aed',
      updatedContent: updatedComponent?.content,
      updatedColor: updatedComponent?.props?.style?.color,
    };

    // Test 5: Delete component
    console.log('🧪 Test 5: Delete component');
    const deleted = deleteComponentById(sampleRoot, 'text-1');
    const deletedComponent = findComponentById(deleted!, 'text-1');
    results.tests.deleteComponent = {
      passed: deletedComponent === null,
      stillExists: deletedComponent !== null,
    };

    // Test 6: Move component up
    console.log('🧪 Test 6: Move component');
    const moved = moveComponent(sampleRoot, 'text-1', 'up');
    const section1 = findComponentById(moved, 'section-1');
    const firstChild = section1?.children?.[0];
    results.tests.moveComponent = {
      passed: firstChild?.id === 'text-1', // text-1 moved up, should be first
      firstChildId: firstChild?.id,
    };

    // Test 7: Duplicate component
    console.log('🧪 Test 7: Duplicate component');
    const duplicated = duplicateComponent(sampleRoot, 'button-1');
    const section2 = findComponentById(duplicated, 'section-2');
    const childrenCount = section2?.children?.length || 0;
    results.tests.duplicateComponent = {
      passed: childrenCount === 2, // Original + duplicate
      childrenCount,
    };

    // Test 8: Get breadcrumbs
    console.log('🧪 Test 8: Get breadcrumbs');
    const breadcrumbs = getBreadcrumbs(sampleRoot, 'button-1');
    results.tests.getBreadcrumbs = {
      passed: breadcrumbs.length === 3 && 
        breadcrumbs[0] === 'Container' &&
        breadcrumbs[1] === 'Section' &&
        breadcrumbs[2] === 'Button',
      breadcrumbs,
    };

    // Test 9: Get tree stats
    console.log('🧪 Test 9: Get tree stats');
    const stats = getTreeStats(sampleRoot);
    results.tests.getTreeStats = {
      passed: stats.totalComponents === 7 &&
        stats.maxDepth === 2 &&
        stats.editableComponents >= 3,
      stats,
    };

    // Test 10: Render with changes
    console.log('🧪 Test 10: Render email');
    const settings: GlobalEmailSettings = {
      fontFamily: 'system-ui, sans-serif',
      primaryColor: '#7c3aed',
      maxWidth: '600px',
    };
    const renderResult = await renderEmailComponent(sampleRoot, settings);
    results.tests.render = {
      passed: !!renderResult.html && renderResult.html.includes('Test Heading'),
      hasHTML: !!renderResult.html,
      htmlLength: renderResult.html?.length || 0,
    };

    // Calculate overall success
    const allPassed = Object.values(results.tests).every((test: any) => test.passed);
    results.success = allPassed;

    const totalTime = Date.now() - startTime;
    console.log(`🎉 [VISUAL-EDITOR-TEST] Tests complete! Time: ${totalTime}ms`);

    return NextResponse.json({
      success: results.success,
      message: allPassed ? 'All tests passed!' : 'Some tests failed',
      results,
      metadata: {
        totalTests: Object.keys(results.tests).length,
        passedTests: Object.values(results.tests).filter((t: any) => t.passed).length,
        totalTimeMs: totalTime,
      },
    });

  } catch (error) {
    console.error('❌ [VISUAL-EDITOR-TEST] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results,
      },
      { status: 500 }
    );
  }
}

