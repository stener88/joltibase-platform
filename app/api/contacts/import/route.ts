import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const ImportContactsSchema = z.object({
  contacts: z.array(z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  })),
  duplicateHandling: z.enum(['skip', 'update', 'replace']).default('skip'),
  listIds: z.array(z.string()).optional(),
});

// ============================================
// POST /api/contacts/import - Import contacts
// ============================================

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = ImportContactsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { contacts, duplicateHandling, listIds } = validationResult.data;

    // Fetch existing contacts to check for duplicates
    const emails = contacts.map(c => c.email.toLowerCase());
    const { data: existingContacts, error: fetchError } = await supabase
      .from('contacts')
      .select('id, email')
      .eq('user_id', user.id)
      .in('email', emails);

    if (fetchError) {
      throw fetchError;
    }

    const existingEmails = new Set(existingContacts?.map(c => c.email.toLowerCase()) || []);
    const existingEmailMap = new Map(existingContacts?.map(c => [c.email.toLowerCase(), c.id]) || []);

    // Process contacts based on duplicate handling strategy
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const contact of contacts) {
      const email = contact.email.toLowerCase();
      const isDuplicate = existingEmails.has(email);

      try {
        if (isDuplicate) {
          if (duplicateHandling === 'skip') {
            skipped++;
            continue;
          } else if (duplicateHandling === 'update' || duplicateHandling === 'replace') {
            const contactId = existingEmailMap.get(email);
            
            const updates: any = {
              email,
            };
            
            if (contact.firstName !== undefined) updates.first_name = contact.firstName || null;
            if (contact.lastName !== undefined) updates.last_name = contact.lastName || null;
            if (contact.tags !== undefined) updates.tags = contact.tags;
            if (contact.metadata !== undefined) updates.metadata = contact.metadata;

            const { error: updateError } = await supabase
              .from('contacts')
              .update(updates)
              .eq('id', contactId)
              .eq('user_id', user.id);

            if (updateError) {
              errors.push(`Failed to update ${email}: ${updateError.message}`);
              continue;
            }

            updated++;
          }
        } else {
          // Insert new contact
          const { data: newContact, error: insertError } = await supabase
            .from('contacts')
            .insert({
              user_id: user.id,
              email,
              first_name: contact.firstName || null,
              last_name: contact.lastName || null,
              status: 'subscribed',
              tags: contact.tags || [],
              metadata: contact.metadata || {},
              source: 'import',
              engagement_score: 0,
              subscribed_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (insertError) {
            errors.push(`Failed to import ${email}: ${insertError.message}`);
            continue;
          }

          // Add to lists if specified
          if (listIds && listIds.length > 0 && newContact) {
            const listMemberships = listIds.map(listId => ({
              contact_id: newContact.id,
              list_id: listId,
            }));

            await supabase
              .from('contact_lists')
              .insert(listMemberships);
          }

          imported++;
        }
      } catch (err: any) {
        errors.push(`Error processing ${email}: ${err.message}`);
      }
    }return NextResponse.json({
      success: true,
      data: {
        imported,
        updated,
        skipped,
        total: contacts.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import contacts' },
      { status: 500 }
    );
  }
}

