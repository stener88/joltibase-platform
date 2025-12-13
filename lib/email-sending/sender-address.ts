/**
 * Sender Address Management
 * 
 * Handles creation and retrieval of user sender addresses
 * Each user gets a default @mail.joltibase.com address automatically
 */

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface SenderAddress {
  id: string;
  user_id: string;
  email: string;
  name: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Ensure user has a default sender address
 * Creates one if it doesn't exist
 * 
 * @param userId - User's UUID from auth.users
 * @param userEmail - User's signup email (for extracting username)
 * @param fullName - User's full name (optional, falls back to username)
 */
export async function ensureDefaultSender(
  userId: string,
  userEmail: string,
  fullName?: string | null
): Promise<SenderAddress> {
  // Check if user already has a default sender
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('sender_addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (fetchError) {
    console.error('❌ [SENDER] Error checking existing sender:', fetchError);
    throw new Error('Failed to check sender address');
  }

  if (existing) {
    console.log(`✅ [SENDER] User ${userId} already has default sender: ${existing.email}`);
    return existing as SenderAddress;
  }

  // Generate sender email: username@mail.joltibase.com
  const username = userEmail.split('@')[0]; // "stener88" from "stener88@gmail.com"
  const senderEmail = `${username}@mail.joltibase.com`;
  const senderName = fullName || username;

  console.log(`📧 [SENDER] Creating default sender for ${userId}: ${senderEmail}`);

  // Create new sender address
  const { data: newSender, error: insertError } = await supabaseAdmin
    .from('sender_addresses')
    .insert({
      user_id: userId,
      email: senderEmail,
      name: senderName,
      is_default: true,
      is_verified: true, // Auto-verified for our domain
    })
    .select()
    .single();

  if (insertError) {
    console.error('❌ [SENDER] Error creating sender:', insertError);
    throw new Error('Failed to create sender address');
  }

  console.log(`✅ [SENDER] Created default sender: ${newSender.email}`);
  return newSender as SenderAddress;
}

/**
 * Get user's default sender address
 */
export async function getDefaultSender(userId: string): Promise<SenderAddress | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('sender_addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (error) {
    console.error('❌ [SENDER] Error fetching default sender:', error);
    return null;
  }

  return data as SenderAddress | null;
}

/**
 * Get all sender addresses for a user
 */
export async function getUserSenders(userId: string): Promise<SenderAddress[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('sender_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ [SENDER] Error fetching senders:', error);
    return [];
  }

  return (data as SenderAddress[]) || [];
}

/**
 * Update sender name
 */
export async function updateSenderName(
  userId: string,
  senderId: string,
  newName: string
): Promise<SenderAddress | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('sender_addresses')
    .update({ name: newName })
    .eq('id', senderId)
    .eq('user_id', userId) // Ensure user owns this sender
    .select()
    .single();

  if (error) {
    console.error('❌ [SENDER] Error updating sender:', error);
    return null;
  }

  return data as SenderAddress;
}
