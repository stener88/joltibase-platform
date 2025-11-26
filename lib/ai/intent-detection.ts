/**
 * Intent Detection for Campaign Refinement
 * 
 * Distinguishes between:
 * - Advice/brainstorming requests (conversational responses)
 * - Refinement requests (actual block modifications)
 */

/**
 * Intent detection result with confidence scoring
 */
export interface IntentResult {
  intent: 'advice' | 'refinement' | 'unclear';
  confidence: number;
  reasoning?: string;
}

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,    // Proceed with detected intent
  MEDIUM: 0.6,  // Proceed but log for review
  LOW: 0.5,     // Ask for clarification
};

/**
 * Detect user intent with context awareness
 */
export function detectUserIntent(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
): IntentResult {
  const lower = message.toLowerCase().trim();
  
  // --- STRONG REFINEMENT SIGNALS (0.95 confidence) ---
  const strongRefinementPatterns = [
    // Direct commands (no ambiguity)
    /^(change|update|modify|edit|replace|delete|remove|add)\b/,
    /^(make it|turn it|convert it)\b/,
    // Imperative with target
    /^(use|set|apply|switch)\b.*\b(to|with)\b/,
    // Confirmation after advice
    /^(yes|yeah|yep|ok|okay|sure|do it|go ahead|please)\b/,
  ];
  
  if (strongRefinementPatterns.some(p => p.test(lower))) {
    return { intent: 'refinement', confidence: 0.95 };
  }
  
  // --- STRONG ADVICE SIGNALS (0.9 confidence) ---
  const strongAdvicePatterns = [
    // Pure questions without action
    /^(what|which|why|when|where)\b.*\?$/,
    /^how (can|could|should|would|do) (i|we)\b.*\?$/,
    // Seeking suggestions - ADD VERB FORMS
    /\b(suggest|recommend|advise|propose)\b/,  // ✅ NEW - catches verbs
    /\b(recommendation|suggestion|advice|tip|idea|thought|feedback|opinion)s?\b/,
    /\b(what do you think|any thoughts|got any)\b/,
    /^(should i|should we)\b.*\?$/,
  ];
  
  const isQuestion = lower.includes('?');
  
  // Remove question mark requirement for clear advisory requests
  if (strongAdvicePatterns.some(p => p.test(lower))) {
    return { intent: 'advice', confidence: 0.9 };
  }
  
  // --- AMBIGUOUS CASES: "Can you..." ---
  const canYouMatch = lower.match(/^(can|could|would) you\b/);
  if (canYouMatch) {
    // "Can you make it shorter?" - probably wants action
    // "Can you suggest improvements?" - wants advice
    const hasActionVerb = /\b(change|make|add|remove|fix|improve|optimize)\b/.test(lower);
    const hasAdvisoryNoun = /\b(suggestion|advice|idea|recommendation|tip)\b/.test(lower);
    
    if (hasActionVerb && !hasAdvisoryNoun) {
      return { intent: 'refinement', confidence: 0.7 };
    }
    if (hasAdvisoryNoun) {
      return { intent: 'advice', confidence: 0.75 };
    }
  }
  
  // --- CONTEXT-AWARE: Check previous message ---
  if (conversationHistory && conversationHistory.length > 0) {
    const lastAssistantMsg = conversationHistory
      .filter(m => m.role === 'assistant')
      .pop();
    
    // If last message was advice, short confirmations = refinement
    if (lastAssistantMsg && /\b(could|might|suggest|recommend)\b/i.test(lastAssistantMsg.content)) {
      const isShortConfirmation = message.split(' ').length <= 3;
      if (isShortConfirmation) {
        return { intent: 'refinement', confidence: 0.85, reasoning: 'Confirmation after advice' };
      }
    }
  }
  
  // --- IMPLICIT ACTION DETECTION ---
  const implicitActionPatterns = [
    /\b(should be|needs to be|has to be|must be)\b/,
    /\b(too (long|short|much|little))\b/,
    /\b(not (enough|sufficient))\b/,
  ];
  
  if (implicitActionPatterns.some(p => p.test(lower))) {
    return { intent: 'refinement', confidence: 0.7, reasoning: 'Implicit action request' };
  }
  
  // --- DEFAULT HEURISTICS ---
  
  // Action verbs without question mark = refinement
  const hasActionVerb = /\b(make|change|add|remove|update|fix)\b/.test(lower);
  if (hasActionVerb && !isQuestion) {
    return { intent: 'refinement', confidence: 0.65 };
  }
  
  // Question without clear advisory keywords = unclear
  if (isQuestion) {
    return { intent: 'unclear', confidence: 0.4 };
  }
  
  // No question, no action = assume refinement (user expects action)
  return { intent: 'refinement', confidence: 0.5 };
}




