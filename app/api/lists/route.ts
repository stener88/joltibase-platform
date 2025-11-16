import { requireAuth } from '@/lib/api/auth';
import { successResponse, errorResponse } from '@/lib/api/responses';

// ============================================
// GET /api/lists - Fetch user's lists
// ============================================

export async function GET(request: Request) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    
    const { user, supabase } = authResult;

    // Fetch all lists for user
    const { data: lists, error: fetchError } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('❌ [LISTS-API] Fetch error:', fetchError);
      throw fetchError;
    }

    return successResponse(lists || []);

  } catch (error: any) {
    console.error('❌ [LISTS-API] Error:', error);
    return errorResponse(error.message || 'Failed to fetch lists');
  }
}
