import { requireAuth } from '@/lib/api/auth';
import { successResponse, errorResponse, CommonErrors } from '@/lib/api/responses';

// ============================================
// GET /api/campaigns/[id] - Get single campaign
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    
    const { user, supabase } = authResult;

    const campaignId = (await params).id;// Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError) {
      return CommonErrors.notFound('Campaign');
    }

    return successResponse(campaign);

  } catch (error: any) {
    
    return errorResponse(error.message || 'Failed to fetch campaign');
  }
}

// ============================================
// PUT /api/campaigns/[id] - Update campaign
// ============================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    
    const { user, supabase } = authResult;

    const campaignId = (await params).id;
    const updates = await request.json();

    // Update campaign
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return successResponse(campaign);

  } catch (error: any) {
    
    return errorResponse(error.message || 'Failed to update campaign');
  }
}

// ============================================
// DELETE /api/campaigns/[id] - Delete campaign
// ============================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    
    const { user, supabase } = authResult;

    const campaignId = (await params).id;

    // Delete campaign (cascade will handle emails)
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return successResponse({ message: 'Campaign deleted' });

  } catch (error: any) {
    
    return errorResponse(error.message || 'Failed to delete campaign');
  }
}
