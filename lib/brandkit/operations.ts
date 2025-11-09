/**
 * Brand Kit Database Operations
 */

import { createClient } from '@/lib/supabase/server';
import type { BrandKit, CreateBrandKitInput, UpdateBrandKitInput } from './types';
import { validateCompanyName, sanitizeCompanyName } from './validation';

/**
 * Get user's active brand kit
 */
export async function getActiveBrandKit(userId: string): Promise<BrandKit | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching brand kit:', error);
    return null;
  }

  return data as BrandKit;
}

/**
 * Create a new brand kit
 */
export async function createBrandKit(
  userId: string,
  input: CreateBrandKitInput
): Promise<BrandKit | null> {
  const supabase = await createClient();

  // Validate company name
  const validation = validateCompanyName(input.companyName);
  if (!validation.isValid) {
    console.warn('Brand kit creation failed:', validation.error);
    throw new Error(validation.error);
  }

  // Sanitize company name (trim, capitalize properly)
  const sanitizedCompanyName = sanitizeCompanyName(input.companyName);

  // Deactivate existing brand kits
  await supabase
    .from('brand_kits')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Create new brand kit
  const { data, error } = await supabase
    .from('brand_kits')
    .insert({
      user_id: userId,
      company_name: sanitizedCompanyName,
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      accent_color: input.accentColor,
      font_style: input.fontStyle || 'modern',
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating brand kit:', error);
    return null;
  }

  return data as BrandKit;
}

/**
 * Update existing brand kit
 */
export async function updateBrandKit(
  brandKitId: string,
  userId: string,
  input: UpdateBrandKitInput
): Promise<BrandKit | null> {
  const supabase = await createClient();

  // Validate and sanitize company name if provided
  let sanitizedCompanyName = input.companyName;
  if (input.companyName) {
    const validation = validateCompanyName(input.companyName);
    if (!validation.isValid) {
      console.warn('Brand kit update failed:', validation.error);
      throw new Error(validation.error);
    }
    sanitizedCompanyName = sanitizeCompanyName(input.companyName);
  }

  const { data, error } = await supabase
    .from('brand_kits')
    .update({
      company_name: sanitizedCompanyName,
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      accent_color: input.accentColor,
      font_style: input.fontStyle,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brandKitId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand kit:', error);
    return null;
  }

  return data as BrandKit;
}

/**
 * Get all brand kits for a user
 */
export async function getUserBrandKits(userId: string): Promise<BrandKit[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brand kits:', error);
    return [];
  }

  return data as BrandKit[];
}

/**
 * Set a brand kit as active
 */
export async function setActiveBrandKit(
  brandKitId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Deactivate all other brand kits
  await supabase
    .from('brand_kits')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Activate the selected one
  const { error } = await supabase
    .from('brand_kits')
    .update({ is_active: true })
    .eq('id', brandKitId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error setting active brand kit:', error);
    return false;
  }

  return true;
}

/**
 * Delete a brand kit
 */
export async function deleteBrandKit(
  brandKitId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('brand_kits')
    .delete()
    .eq('id', brandKitId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting brand kit:', error);
    return false;
  }

  return true;
}

/**
 * Get or create brand kit (ensures user always has one)
 */
export async function getOrCreateBrandKit(
  userId: string,
  companyName?: string
): Promise<BrandKit> {
  // Try to get existing
  let brandKit = await getActiveBrandKit(userId);

  // Create default if doesn't exist
  if (!brandKit) {
    brandKit = await createBrandKit(userId, {
      companyName: companyName || 'My Company',
      primaryColor: '#2563eb',
      secondaryColor: '#f59e0b',
      fontStyle: 'modern',
    });
  }

  // Fallback
  if (!brandKit) {
    throw new Error('Failed to get or create brand kit');
  }

  return brandKit;
}