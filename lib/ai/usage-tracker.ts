/**
 * AI Campaign Generator - Usage Tracking
 * 
 * Save AI generations to database for tracking and auditing
 * 
 * IMPORTANT: Required Database Setup
 * ===================================
 * 
 * The ai_usage table requires RLS (Row Level Security) policies to allow inserts.
 * Run this SQL in your Supabase Dashboard (SQL Editor):
 * 
 * ```sql
 * -- Allow authenticated users to insert their own usage records
 * CREATE POLICY "Users can insert their own usage"
 * ON ai_usage FOR INSERT
 * TO authenticated
 * WITH CHECK (auth.uid() = user_id);
 * 
 * -- Allow authenticated users to read their own usage records
 * CREATE POLICY "Users can view their own usage"
 * ON ai_usage FOR SELECT
 * TO authenticated
 * USING (auth.uid() = user_id);
 * ```
 */

import { createClient } from '@/lib/supabase/server';
// Legacy import - define type locally
type GeneratedCampaign = any;

// ============================================================================
// Usage Tracking Interfaces
// ============================================================================

export interface SaveGenerationInput {
  userId: string;
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  campaignType?: string;
  generatedContent: GeneratedCampaign;
  model: string;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  generationTimeMs: number;
}

export interface AIGenerationRecord {
  id: string;
  userId: string;
  prompt: string;
  generatedContent: GeneratedCampaign;
  model: string;
  tokensUsed: number;
  costUsd: number;
  createdAt: Date;
}

// ============================================================================
// Usage Tracking Functions
// ============================================================================

/**
 * Save AI generation to database
 */
export async function saveAIGeneration(input: SaveGenerationInput): Promise<string> {
  console.log('💾 [USAGE] Saving AI generation to database...');
  const supabase = await createClient();
  
  try {
    // Save to ai_generations table
    console.log('📝 [USAGE] Inserting into ai_generations table...', { userId: input.userId });
    const { data, error } = await supabase
      .from('ai_generations')
      .insert({
        user_id: input.userId,
        prompt: input.prompt,
        company_name: input.companyName,
        product_description: input.productDescription,
        target_audience: input.targetAudience,
        tone: input.tone,
        campaign_type: input.campaignType,
        generated_content: input.generatedContent,
        model: input.model,
        model_version: input.model, // Store full model name
        tokens_used: input.tokensUsed,
        prompt_tokens: input.promptTokens,
        completion_tokens: input.completionTokens,
        cost_usd: input.costUsd,
        generation_time_ms: input.generationTimeMs,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('❌ [USAGE] Error saving AI generation:', error);
      console.error('📍 [USAGE] Error details:', { code: error.code, message: error.message, details: error.details });
      throw new Error('Failed to save generation to database');
    }
    
    console.log('✅ [USAGE] AI generation saved successfully:', { id: data.id });
    
    // Also track in ai_usage table for rate limiting
    console.log('📊 [USAGE] Tracking usage for rate limiting...');
    await trackUsage(input.userId, input.tokensUsed, input.costUsd);
    
    console.log('✅ [USAGE] saveAIGeneration complete, returning ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error in saveAIGeneration:', error);
    throw error;
  }
}

/**
 * Track usage for rate limiting
 */
async function trackUsage(userId: string, tokensUsed: number, costUsd: number): Promise<void> {
  console.log('📊 [USAGE] trackUsage called:', { userId, tokensUsed, costUsd });
  const supabase = await createClient();
  
  try {
    console.log('📝 [USAGE] Inserting into ai_usage table with feature: campaign_generator');
    const { error } = await supabase
      .from('ai_usage')
      .insert({
        user_id: userId,
        feature: 'campaign_generator',
        tokens_used: tokensUsed,
        cost_usd: costUsd,
      });
    
    if (error) {
      console.error('❌ [USAGE] Error tracking usage:', error);
      console.error('📍 [USAGE] Error details:', { code: error.code, message: error.message, details: error.details, hint: error.hint });
      // Don't throw - tracking failure shouldn't block generation
    } else {
      console.log('✅ [USAGE] Usage tracked successfully');
    }
  } catch (error) {
    console.error('❌ [USAGE] Unexpected error in trackUsage:', error);
    // Don't throw - tracking failure shouldn't block generation
  }
}

/**
 * Get user's generation history
 */
export async function getGenerationHistory(
  userId: string,
  limit: number = 10
): Promise<AIGenerationRecord[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('ai_generations')
      .select('id, user_id, prompt, generated_content, model, tokens_used, cost_usd, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching generation history:', error);
      throw new Error('Failed to fetch generation history');
    }
    
    return (data || []).map(record => ({
      id: record.id,
      userId: record.user_id,
      prompt: record.prompt,
      generatedContent: record.generated_content as GeneratedCampaign,
      model: record.model,
      tokensUsed: record.tokens_used,
      costUsd: record.cost_usd,
      createdAt: new Date(record.created_at),
    }));
  } catch (error) {
    console.error('Error in getGenerationHistory:', error);
    throw error;
  }
}

/**
 * Get a specific generation by ID
 */
export async function getGenerationById(
  generationId: string,
  userId: string
): Promise<AIGenerationRecord | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', userId) // Ensure user owns this generation
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching generation:', error);
      throw new Error('Failed to fetch generation');
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      prompt: data.prompt,
      generatedContent: data.generated_content as GeneratedCampaign,
      model: data.model,
      tokensUsed: data.tokens_used,
      costUsd: data.cost_usd,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error in getGenerationById:', error);
    throw error;
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStatistics(userId: string): Promise<{
  totalGenerations: number;
  totalTokens: number;
  totalCost: number;
  thisMonthGenerations: number;
  thisMonthCost: number;
}> {
  const supabase = await createClient();
  
  try {
    // Get all-time stats
    const { data: allTimeData, error: allTimeError } = await supabase
      .from('ai_generations')
      .select('tokens_used, cost_usd')
      .eq('user_id', userId);
    
    if (allTimeError) {
      console.error('Error fetching usage statistics:', allTimeError);
      throw new Error('Failed to fetch usage statistics');
    }
    
    // Get this month's stats
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthData, error: monthError } = await supabase
      .from('ai_generations')
      .select('cost_usd')
      .eq('user_id', userId)
      .gte('created_at', firstDayOfMonth.toISOString());
    
    if (monthError) {
      console.error('Error fetching monthly statistics:', monthError);
      throw new Error('Failed to fetch monthly statistics');
    }
    
    // Calculate totals
    const totalGenerations = allTimeData?.length || 0;
    const totalTokens = allTimeData?.reduce((sum, record) => sum + (record.tokens_used || 0), 0) || 0;
    const totalCost = allTimeData?.reduce((sum, record) => sum + (record.cost_usd || 0), 0) || 0;
    const thisMonthGenerations = monthData?.length || 0;
    const thisMonthCost = monthData?.reduce((sum, record) => sum + (record.cost_usd || 0), 0) || 0;
    
    return {
      totalGenerations,
      totalTokens,
      totalCost,
      thisMonthGenerations,
      thisMonthCost,
    };
  } catch (error) {
    console.error('Error in getUsageStatistics:', error);
    throw error;
  }
}

