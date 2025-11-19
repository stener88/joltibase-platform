/**
 * API Route: Load Campaign V2
 * 
 * GET /api/campaigns/[id]/v2
 * 
 * Loads a V2 campaign with rootComponent for visual editing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: campaignId } = await params;

    // Load campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return errorResponse('Campaign not found', 404);
    }

    // Check if it's a V2 campaign
    if (campaign.version !== 'v2') {
      return errorResponse('Campaign is not version 2', 400);
    }

    // Return campaign data
    return successResponse({
      campaign: {
        id: campaign.id,
        campaignName: campaign.campaign_name,
        version: campaign.version,
        rootComponent: campaign.root_component,
        globalSettings: campaign.global_settings || {
          fontFamily: 'system-ui, sans-serif',
          primaryColor: '#7c3aed',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
        },
        subject: campaign.subject,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
      },
    });
  } catch (error) {
    console.error('Load V2 campaign error:', error);
    return errorResponse('Failed to load campaign', 500);
  }
}

/**
 * UPDATE Campaign V2
 * 
 * PUT /api/campaigns/[id]/v2
 * 
 * Updates a V2 campaign's rootComponent and globalSettings
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: campaignId } = await params;
    const body = await request.json();

    const { rootComponent, globalSettings, subject } = body;

    if (!rootComponent) {
      return errorResponse('rootComponent is required', 400);
    }

    // Update campaign
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        root_component: rootComponent,
        global_settings: globalSettings,
        subject: subject,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return errorResponse('Failed to update campaign', 500);
    }

    return successResponse({
      success: true,
      campaign: {
        id: campaign.id,
        rootComponent: campaign.root_component,
        globalSettings: campaign.global_settings,
        updatedAt: campaign.updated_at,
      },
    });
  } catch (error) {
    console.error('Update V2 campaign error:', error);
    return errorResponse('Failed to update campaign', 500);
  }
}

