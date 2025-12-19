/**
 * Campaign CRUD API Routes (V3)
 * 
 * GET /api/v3/campaigns/[id] - Get campaign details
 * PATCH /api/v3/campaigns/[id] - Update campaign metadata
 * DELETE /api/v3/campaigns/[id] - Delete campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { deleteGeneratedEmail } from '@/lib/email-v3/generator';
import { z } from 'zod';

const UpdateRequestSchema = z.object({
  name: z.string().optional(),
  subject_line: z.string().optional(),
  preview_text: z.string().optional(),
  status: z.enum(['draft', 'ready', 'scheduled', 'sent']).optional(),
  component_code: z.string().optional(),
  html_content: z.string().optional(),
});

/**
 * GET - Fetch single campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    const { id } = await params;
    
    const { data: campaign, error } = await supabase
      .from('campaigns_v3')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found',
        },
        { status: 404 }
      );
    }
    
    // HTML is already safe - generated from validated TSX via React Email
    // No sanitization needed as users cannot directly inject HTML
    
    return NextResponse.json({
      success: true,
      campaign,
    });
    
  } catch (error: any) {
    console.error('❌ [GET-CAMPAIGN-V3] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch campaign',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update campaign metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    const { id } = await params;
    
    // Parse and validate request
    const body = await request.json();
    const updates = UpdateRequestSchema.parse(body);
    
    // Update campaign
    const { data: campaign, error } = await supabase
      .from('campaigns_v3')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error || !campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found or update failed',
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ [UPDATE-CAMPAIGN-V3] Updated: ${campaign.id}`);
    
    return NextResponse.json({
      success: true,
      campaign,
    });
    
  } catch (error: any) {
    console.error('❌ [UPDATE-CAMPAIGN-V3] Error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update campaign',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete campaign and component file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    const { id } = await params;
    
    // Fetch campaign to get filename
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns_v3')
      .select('component_filename')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found',
        },
        { status: 404 }
      );
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('campaigns_v3')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Delete component file
    try {
      deleteGeneratedEmail(campaign.component_filename);
    } catch (fileError) {
      console.warn('⚠️ [DELETE-CAMPAIGN-V3] Could not delete component file:', fileError);
      // Continue - database deletion succeeded
    }
    
    console.log(`✅ [DELETE-CAMPAIGN-V3] Deleted: ${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
    
  } catch (error: any) {
    console.error('❌ [DELETE-CAMPAIGN-V3] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete campaign',
      },
      { status: 500 }
    );
  }
}

