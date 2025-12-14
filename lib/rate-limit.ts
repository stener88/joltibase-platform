/**
 * Simple in-memory rate limiter for campaign processing
 * Prevents abuse of the processQueue endpoint
 */

const callCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  campaignId: string,
  maxCalls: number = 10,
  windowMs: number = 3600000 // 1 hour
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = callCounts.get(campaignId);

  // Clean up old entries
  if (record && now > record.resetAt) {
    callCounts.delete(campaignId);
  }

  // Get or create record
  const current = callCounts.get(campaignId) || {
    count: 0,
    resetAt: now + windowMs,
  };

  // Check limit
  if (current.count >= maxCalls) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  // Increment
  current.count++;
  callCounts.set(campaignId, current);

  return {
    allowed: true,
    remaining: maxCalls - current.count,
  };
}

/**
 * Reset rate limit for a campaign (useful for testing or manual resets)
 */
export function resetRateLimit(campaignId: string): void {
  callCounts.delete(campaignId);
}
