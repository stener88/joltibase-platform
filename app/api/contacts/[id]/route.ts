import { requireAuth } from '@/lib/api/auth';
import { successResponse, errorResponse, CommonErrors } from '@/lib/api/responses';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const UpdateContactSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  listIds: z.array(z.string()).optional(),
});

// ============================================
// GET /api/contacts/[id] - Get single contact
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

    const contactId = (await params).id;
    console.log(`📥 [CONTACTS-API] Fetching contact: ${contactId} for user: ${user.id}`);

    // Get contact with list memberships
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*, contact_lists(list_id, lists(id, name))')
      .eq('id', contactId)
      .eq('user_id', user.id)
      .single();

    if (contactError) {
      console.error('❌ [CONTACTS-API] Fetch error:', contactError);
      return CommonErrors.notFound('Contact');
    }

    // Transform the data to flatten lists
    const transformedContact = {
      ...contact,
      lists: contact.contact_lists?.map((cl: any) => cl.lists).filter(Boolean) || [],
      contact_lists: undefined,
    };

    // Get activity history
    const { data: activities, error: activityError } = await supabase
      .from('contact_activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (activityError) {
      console.error('❌ [CONTACTS-API] Activity fetch error:', activityError);
      // Don't fail the request, just return empty activities
    }

    return successResponse({
      ...transformedContact,
      activities: activities || [],
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return errorResponse(error.message || 'Failed to fetch contact');
  }
}

// ============================================
// PUT /api/contacts/[id] - Update contact
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

    const contactId = (await params).id;
    const body = await request.json();
    
    // Validate input
    const validationResult = UpdateContactSchema.safeParse(body);
    if (!validationResult.success) {
      return CommonErrors.validationError('Validation failed', validationResult.error.issues);
    }

    const { email, firstName, lastName, status, tags, metadata, listIds } = validationResult.data;

    // If email is being changed, check for duplicates
    if (email) {
      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('email', email.toLowerCase())
        .neq('id', contactId)
        .maybeSingle();

      if (existing) {
        return errorResponse('Another contact with this email already exists', 409, 'DUPLICATE_EMAIL');
      }
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (email !== undefined) updates.email = email.toLowerCase();
    if (firstName !== undefined) updates.first_name = firstName || null;
    if (lastName !== undefined) updates.last_name = lastName || null;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'subscribed' && !updates.subscribed_at) {
        updates.subscribed_at = new Date().toISOString();
      }
    }
    if (tags !== undefined) updates.tags = tags;
    if (metadata !== undefined) updates.metadata = metadata;

    // Update contact
    const { data: contact, error: updateError } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [CONTACTS-API] Update error:', updateError);
      throw updateError;
    }

    // Update list memberships if provided
    if (listIds !== undefined) {
      // Remove all existing memberships
      await supabase
        .from('contact_lists')
        .delete()
        .eq('contact_id', contactId);

      // Add new memberships
      if (listIds.length > 0) {
        const memberships = listIds.map(listId => ({
          contact_id: contactId,
          list_id: listId,
        }));

        const { error: listError } = await supabase
          .from('contact_lists')
          .insert(memberships);

        if (listError) {
          console.error('❌ [CONTACTS-API] List membership error:', listError);
        }
      }
    }

    console.log('✅ [CONTACTS-API] Contact updated:', contact.id);
    return successResponse(contact);

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return errorResponse(error.message || 'Failed to update contact');
  }
}

// ============================================
// DELETE /api/contacts/[id] - Delete contact
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

    const contactId = (await params).id;

    // Delete contact (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('❌ [CONTACTS-API] Delete error:', deleteError);
      throw deleteError;
    }

    console.log('✅ [CONTACTS-API] Contact deleted:', contactId);
    return successResponse({ message: 'Contact deleted successfully' });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return errorResponse(error.message || 'Failed to delete contact');
  }
}
