import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// POST /api/lists/[id]/contacts - Add contacts to list
// ============================================

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const listId = (await params).id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contactIds } = body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact IDs are required' },
        { status: 400 }
      );
    }

    // Verify list belongs to user
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('id')
      .eq('id', listId)
      .eq('user_id', user.id)
      .single();

    if (listError || !list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Verify all contacts belong to user
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id')
      .in('id', contactIds)
      .eq('user_id', user.id);

    if (contactsError || !contacts || contacts.length !== contactIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more contacts not found' },
        { status: 404 }
      );
    }

    // Create contact_lists records (ignore duplicates)
    const records = contactIds.map(contactId => ({
      list_id: listId,
      contact_id: contactId,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('contact_lists')
      .upsert(records, { onConflict: 'contact_id,list_id', ignoreDuplicates: true })
      .select();

    if (insertError) throw insertError;

    // Update list contact count
    const { error: rpcError } = await supabase.rpc('update_list_contact_count', { list_uuid: listId });
    
    if (rpcError) {
      console.warn('⚠️ RPC update_list_contact_count failed, using fallback:', rpcError);
      
      // Fallback: Manually update contact_count if RPC fails
      const { count } = await supabase
        .from('contact_lists')
        .select('*', { count: 'exact', head: true })
        .eq('list_id', listId);
      
      await supabase
        .from('lists')
        .update({ 
          contact_count: count || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId);
    }

    return NextResponse.json({
      success: true,
      data: {
        added: inserted?.length || 0,
        message: `${inserted?.length || 0} contact(s) added to list`,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/lists/[id]/contacts - Remove contacts from list
// ============================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const listId = (await params).id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contactIds } = body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact IDs are required' },
        { status: 400 }
      );
    }

    // Verify list belongs to user
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('id')
      .eq('id', listId)
      .eq('user_id', user.id)
      .single();

    if (listError || !list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Remove contacts from list
    const { error: deleteError } = await supabase
      .from('contact_lists')
      .delete()
      .eq('list_id', listId)
      .in('contact_id', contactIds);

    if (deleteError) throw deleteError;

    // Update list contact count
    const { error: rpcError } = await supabase.rpc('update_list_contact_count', { list_uuid: listId });
    
    if (rpcError) {
      console.warn('⚠️ RPC update_list_contact_count failed, using fallback:', rpcError);
      
      // Fallback: Manually update contact_count if RPC fails
      const { count } = await supabase
        .from('contact_lists')
        .select('*', { count: 'exact', head: true })
        .eq('list_id', listId);
      
      await supabase
        .from('lists')
        .update({ 
          contact_count: count || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId);
    }

    return NextResponse.json({
      success: true,
      message: `${contactIds.length} contact(s) removed from list`,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

