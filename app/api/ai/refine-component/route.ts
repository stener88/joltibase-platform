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
  refineComponent as refineComponentAI,
  RefineComponentRequestSchema,
  validateComponentTree,
  type EmailComponent,
  type RefinementContext,
  type GlobalEmailSettings,
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
 * Find all components of a specific type in the tree and calculate position
 */
function getComponentPosition(
  root: EmailComponent,
  targetComponent: EmailComponent,
  componentType: string
): string | undefined {
  // Collect all components of this type in order
  const components: EmailComponent[] = [];
  
  function traverse(node: EmailComponent) {
    if (node.component === componentType) {
      components.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(root);
  
  if (components.length === 0) return undefined;
  
  // Find the index of the target component
  const index = components.findIndex(c => c.id === targetComponent.id);
  
  if (index === -1) return undefined;
  
  const position = index + 1; // 1-indexed for user-friendly display
  const total = components.length;
  
  return `${componentType} #${position} (of ${total} total ${componentType}${total > 1 ? 's' : ''})`;
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

    // Validate tree BEFORE applying changes to help debug issues
    const preValidation = validateComponentTree(rootComponent);
    if (!preValidation.valid) {
      console.warn('⚠️  [REFINE-COMPONENT-V2] Tree has pre-existing validation issues:', preValidation.errors);
      console.warn('⚠️  [REFINE-COMPONENT-V2] This may cause refinement to fail');
    }

    // Find component at path
    const targetComponent = getComponentAtPath(rootComponent, componentPath);
    if (!targetComponent) {
      return NextResponse.json(
        { error: 'Component not found at path' },
        { status: 404 }
      );
    }

    console.log('✅ [REFINE-COMPONENT-V2] Component found:', targetComponent.component);

    // Calculate component position (e.g., "Heading #2 (of 3 total Headings)")
    const componentPosition = getComponentPosition(
      rootComponent,
      targetComponent,
      targetComponent.component
    );

    // Build context from existing campaign data (already stored during generation)
    const context: RefinementContext = {
      emailSubject: campaign.subject_line,
      emailPreviewText: campaign.preview_text,
      campaignName: campaign.name,
      originalPrompt: campaign.ai_prompt, // The original generation prompt
      componentPath,
      componentPosition,
      globalSettings: campaign.global_settings as GlobalEmailSettings,
    };

    // Get sibling components for additional context
    try {
      const pathParts = componentPath.split('.');
      if (pathParts.length > 1) {
        const parentPath = pathParts.slice(0, -1).join('.');
        const parentComponent = getComponentAtPath(rootComponent, parentPath);
        
        if (parentComponent?.children) {
          context.siblingComponents = parentComponent.children.filter(
            (c: EmailComponent) => c.id !== targetComponent.id
          );
        }
      }
    } catch (error) {
      console.warn('[REFINE-COMPONENT-V2] Could not get siblings:', error);
    }

    console.log('📋 [REFINE-COMPONENT-V2] Context prepared:', {
      subject: context.emailSubject?.substring(0, 30),
      hasOriginalPrompt: !!context.originalPrompt,
      siblings: context.siblingComponents?.length || 0,
      position: context.componentPosition,
    });

    // Refine with AI - NOW WITH CONTEXT
    const changes = await refineComponentAI(targetComponent, prompt, context);
    
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

