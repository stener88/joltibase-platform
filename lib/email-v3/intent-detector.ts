/**
 * Intent Detection for AI Chat
 * 
 * Determines whether the user is asking a question (consultation)
 * or giving a command (execution).
 */

export type UserIntent = 'question' | 'command';

export interface IntentResult {
  intent: UserIntent;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect user intent from their message
 * 
 * @param message - User's message
 * @returns Intent type (question or command)
 */
export function detectIntent(message: string): UserIntent {
  const msg = message.toLowerCase().trim();
  
  // Empty or very short messages default to command
  if (msg.length < 3) return 'command';
  
  // ✅ STEP 1: Check for command words FIRST (highest priority)
  // Action words indicate commands even if phrased as questions
  const commandWords = [
    'make', 'change', 'add', 'remove', 'delete', 'update',
    'modify', 'replace', 'set', 'create', 'insert',
  ];
  
  const hasCommand = commandWords.some(word => msg.includes(word));
  
  // If it has command words, it's a command even if phrased politely
  // "Can you change this?" = command (has "change")
  // "Should I delete this?" = command (has "delete")
  if (hasCommand) {
    return 'command';
  }
  
  // ✅ STEP 2: Check for question mark (only if no command words)
  if (msg.endsWith('?')) return 'question';
  
  // ✅ STEP 3: Question words at the start
  const questionStarters = [
    'what', 'how', 'why', 'when', 'where', 'who', 'which',
    'can you', 'could you', 'would you', 'should i',
    'do you think', 'any ideas', 'got any', 'have any'
  ];
  
  if (questionStarters.some(starter => msg.startsWith(starter))) {
    return 'question';
  }
  
  // ✅ STEP 4: Advisory/consultation words anywhere in message
  const consultationWords = [
    'recommend', 'suggestion', 'idea', 'advice', 
    'what do you think', 'should i', 'any thoughts',
    'what about', 'how about', 'can you suggest',
    'what would', 'which is better', 'your opinion',
    'thoughts on', 'feedback on', 'improve',
  ];
  
  if (consultationWords.some(word => msg.includes(word))) {
    return 'question';
  }
  
  // ✅ STEP 5: Default to command for ambiguous cases
  return 'command';
}

/**
 * Detect intent with confidence level
 * Useful for logging and debugging
 */
export function detectIntentWithConfidence(message: string): IntentResult {
  const msg = message.toLowerCase().trim();
  const intent = detectIntent(message);
  
  // High confidence signals
  if (msg.endsWith('?') && !msg.includes('change') && !msg.includes('make')) {
    return { intent: 'question', confidence: 'high' };
  }
  
  if (msg.startsWith('make ') || msg.startsWith('change ') || msg.startsWith('delete ')) {
    return { intent: 'command', confidence: 'high' };
  }
  
  // Medium confidence
  if (intent === 'question' && (msg.includes('recommend') || msg.includes('suggest'))) {
    return { intent, confidence: 'medium' };
  }
  
  // Low confidence - ambiguous
  return { intent, confidence: 'low' };
}

