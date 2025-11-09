/**
 * AI Campaign Generator - Rate Limiting
 * 
 * Check generation limits before allowing AI generation
 */

import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Rate Limit Configuration
// ============================================================================

export const RATE_LIMITS = {
  FREE: {
    dailyLimit: 5,
    monthlyLimit: 150,
    tier: 'free' as const,
  },
  STARTER: {
    dailyLimit: 20,
    monthlyLimit: 100,
    tier: 'starter' as const,
  },
  PRO: {
    dailyLimit: 1000,
    monthlyLimit: 1000,
    tier: 'pro' as const,
  },
} as const;

export type RateLimitTier = keyof typeof RATE_LIMITS;

// ============================================================================
// Rate Limit Info Interface
// ============================================================================

export interface RateLimitInfo {
  canGenerate: boolean;
  tier: RateLimitTier;
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  resetDate?: Date;
  message?: string;
}

// ============================================================================
// Rate Limit Functions
// ============================================================================

/**
 * Get user's rate limit tier from database
 * In production, this would check subscription status
 * For now, defaults to PRO tier for testing
 */
async function getUserTier(userId: string): Promise<RateLimitTier> {
  // TODO: Query user's subscription tier from database
  // For testing, everyone gets PRO tier (1000 generations/day)
  return 'PRO';
}

/**
 * Get generation counts from database
 */
async function getGenerationCounts(userId: string): Promise<{ daily: number; monthly: number }> {
  const supabase = await createClient();
  
  try {
    // Get daily count
    const { data: dailyData, error: dailyError } = await supabase
      .rpc('get_daily_ai_generation_count', { p_user_id: userId });
    
    if (dailyError) {
      console.error('Error fetching daily count:', dailyError);
      throw new Error('Failed to check daily limit');
    }
    
    // Get monthly count
    const { data: monthlyData, error: monthlyError } = await supabase
      .rpc('get_monthly_ai_generation_count', { p_user_id: userId });
    
    if (monthlyError) {
      console.error('Error fetching monthly count:', monthlyError);
      throw new Error('Failed to check monthly limit');
    }
    
    return {
      daily: dailyData || 0,
      monthly: monthlyData || 0,
    };
  } catch (error) {
    console.error('Error in getGenerationCounts:', error);
    // Return 0s on error to fail open (allow generation)
    return { daily: 0, monthly: 0 };
  }
}

/**
 * Check if user can generate a campaign
 */
export async function checkRateLimit(userId: string): Promise<RateLimitInfo> {
  // Get user's tier
  const tier = await getUserTier(userId);
  const limits = RATE_LIMITS[tier];
  
  // Get current usage
  const counts = await getGenerationCounts(userId);
  
  // Calculate remaining
  const dailyRemaining = Math.max(0, limits.dailyLimit - counts.daily);
  const monthlyRemaining = Math.max(0, limits.monthlyLimit - counts.monthly);
  
  // Check if can generate
  const canGenerate = counts.daily < limits.dailyLimit && counts.monthly < limits.monthlyLimit;
  
  // Build result
  const result: RateLimitInfo = {
    canGenerate,
    tier,
    dailyLimit: limits.dailyLimit,
    monthlyLimit: limits.monthlyLimit,
    dailyUsed: counts.daily,
    monthlyUsed: counts.monthly,
    dailyRemaining,
    monthlyRemaining,
  };
  
  // Add helpful message if limit reached
  if (!canGenerate) {
    if (counts.daily >= limits.dailyLimit) {
      result.message = `Daily limit reached (${limits.dailyLimit} generations per day). Try again tomorrow.`;
      // Set reset date to tomorrow at midnight
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      result.resetDate = tomorrow;
    } else if (counts.monthly >= limits.monthlyLimit) {
      result.message = `Monthly limit reached (${limits.monthlyLimit} generations per month). Upgrade your plan for more.`;
      // Set reset date to first day of next month
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      result.resetDate = nextMonth;
    }
  }
  
  return result;
}

/**
 * Check rate limit and throw error if exceeded
 */
export async function enforceRateLimit(userId: string): Promise<void> {
  const limitInfo = await checkRateLimit(userId);
  
  if (!limitInfo.canGenerate) {
    throw new RateLimitError(
      limitInfo.message || 'Rate limit exceeded',
      limitInfo
    );
  }
}

/**
 * Custom error for rate limit exceeded
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public limitInfo: RateLimitInfo
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Get rate limit info for display (e.g., in UI)
 */
export async function getRateLimitStatus(userId: string): Promise<RateLimitInfo> {
  return checkRateLimit(userId);
}

