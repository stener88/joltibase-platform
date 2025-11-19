/**
 * AI Component Refinement API
 * 
 * POST /api/ai/refine-component
 * 
 * Refines a single component in an email using AI
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  refineComponent,
  RefineComponentRequestSchema,
  validateComponentTree,
  type EmailComponent,
} from '@/lib/email-v2';

/**
 * Get component at path in component tree
 */
function getComponentAtPath(root: EmailComponent, path: string): EmailComponent | null {
  const parts = path.split('.');
  let current: any = { root };
  
  for (const part of parts) {
    if (part.includes('[')) {
      // Handle array access: children[0]
      const [key, indexStr] = part.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      current = current[key]?.[index];
    } else {
      current = current[part];
    }
    
    if (!current) return null;
  }
  
  return current as EmailComponent;
}

/**
 * Apply changes to component at path
 */
function applyChangesToComponent(
  root: EmailComponent,
  path: string,
  changes: Partial<EmailComponent>
): EmailComponent {
  // Clone the root to avoid mutation
  const cloned = JSON.parse(JSON.stringify(root)) as EmailComponent;
  
  const parts = path.split('.');
  let current: any = { root: cloned };
  let parent: any = null;
  let lastKey: string = 'root';
  
  for (const part of parts) {
    parent = current;
    lastKey = part;
    
    if (part.includes('[')) {
      const [key, indexStr] = part.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      current = current[key]?.[index];
    } else {
      current = current[part];
    }
    
    if (!current && parent) {
      // Path doesn't exist
      throw new Error(`Invalid path: ${path}`);
    }
  }
  
  // Apply changes
  if (changes.props) {
    // Merge props deeply
    current.props = { ...current.props, ...changes.props };
    
    // If style changes, merge style specifically
    if (changes.props.style && current.props.style) {
      current.props.style = { ...current.props.style, ...changes.props.style };
    }
  }
  
  if (changes.content !== undefined) {
    current.content = changes.content;
  }
  
  return cloned;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 [REFINE-COMPONENT-V2] Request from user:', user.id);

    // Parse and validate request
    const body = await req.json();
    const validation = RefineComponentRequestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('❌ [REFINE-COMPONENT-V2] Invalid request:', validation.error);
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    const { prompt, campaignId, componentPath } = validation.data;
    
    console.log('📝 [REFINE-COMPONENT-V2] Prompt:', prompt);
    console.log('📧 [REFINE-COMPONENT-V2] Campaign ID:', campaignId);
    console.log('🎯 [REFINE-COMPONENT-V2] Component path:', componentPath);

    // Get campaign and verify ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.version !== 'v2' || !campaign.root_component) {
      return NextResponse.json(
        { error: 'Campaign is not v2 or has no root component' },
        { status: 400 }
      );
    }

    console.log('✅ [REFINE-COMPONENT-V2] Campaign ownership verified');

    const rootComponent = campaign.root_component as EmailComponent;

    // Find component at path
    const targetComponent = getComponentAtPath(rootComponent, componentPath);
    if (!targetComponent) {
      return NextResponse.json(
        { error: 'Component not found at path' },
        { status: 404 }
      );
    }

    console.log('✅ [REFINE-COMPONENT-V2] Component found:', targetComponent.component);

    // Refine with AI
    const changes = await refineComponent(targetComponent, prompt);
    
    console.log('✅ [REFINE-COMPONENT-V2] Changes generated:', changes);

    // Apply changes
    const updatedRoot = applyChangesToComponent(rootComponent, componentPath, changes);

    // Validate updated structure
    const treeValidation = validateComponentTree(updatedRoot);
    if (!treeValidation.valid) {
      console.error('❌ [REFINE-COMPONENT-V2] Invalid component tree after changes:', treeValidation.errors);
      return NextResponse.json(
        { 
          error: 'Changes resulted in invalid structure',
          details: treeValidation.errors
        },
        { status: 500 }
      );
    }

    console.log('✅ [REFINE-COMPONENT-V2] Structure validated');

    // Save to database
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        root_component: updatedRoot,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('❌ [REFINE-COMPONENT-V2] Database update failed:', updateError);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    console.log('✅ [REFINE-COMPONENT-V2] Saved to database');

    const totalTime = Date.now() - startTime;
    console.log(`🎉 [REFINE-COMPONENT-V2] Complete! Total time: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      rootComponent: updatedRoot,
      changes,
      metadata: {
        totalTimeMs: totalTime,
      },
    });

  } catch (error) {
    console.error('❌ [REFINE-COMPONENT-V2] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Component refinement failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

