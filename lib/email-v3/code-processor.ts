/**
 * Code Processor
 * 
 * Validates TSX code changes and generates diffs.
 * Used by the refine API route after AI generates modified code.
 * 
 * NOTE: This is a utility module - the actual AI calls happen in
 * /app/api/v3/campaigns/refine/route.ts
 */

import { validateTsxCode } from './code-validator';
import { generateDiff, type CodeChange } from './diff-generator';

/**
 * Validate and generate diff for code changes
 * Called after AI generates new code
 */
export function processCodeChanges(params: {
  oldCode: string;
  newCode: string;
  userMessage: string;
}): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  changes: CodeChange[];
  conversationalResponse: string;
} {
  // Validate the new code
  const validation = validateTsxCode(params.newCode);
  
  // Generate diff
  const changes = generateDiff(params.oldCode, params.newCode);
  
  // Generate conversational response
  const conversationalResponse = generateConversationalResponse(
    params.userMessage,
    changes
  );
  
  return {
    valid: validation.valid,
    errors: validation.errors,
    warnings: validation.warnings,
    changes,
    conversationalResponse,
  };
}

/**
 * Generate a natural, conversational response based on changes
 */
function generateConversationalResponse(userMessage: string, changes: CodeChange[]): string {
  const msg = userMessage.toLowerCase();
  
  // Specific responses based on change types
  if (changes.length === 0) {
    return "Hmm, I'm not sure what to change. Can you be more specific?";
  }
  
  if (changes.some(c => c.type === 'removed')) {
    return "Done! I've removed that for you.";
  }
  
  if (changes.some(c => c.property === 'src')) {
    return "Great choice! I've updated the image.";
  }
  
  if (changes.some(c => c.property === 'color')) {
    const colorChange = changes.find(c => c.property === 'color');
    return `Perfect! Changed the color to ${colorChange?.newValue || 'your selection'}.`;
  }
  
  if (changes.some(c => c.property === 'text')) {
    return "Updated the text for you!";
  }
  
  if (changes.some(c => c.type === 'added')) {
    return "Done! I've added that to your email.";
  }
  
  // Contextual responses
  if (msg.includes('bigger') || msg.includes('larger')) {
    return "Made it bigger! Let me know if you'd like it even larger.";
  }
  
  if (msg.includes('smaller')) {
    return "Made it smaller for you!";
  }
  
  if (msg.includes('center') || msg.includes('align')) {
    return "Perfect! Adjusted the alignment.";
  }
  
  if (msg.includes('spacing') || msg.includes('padding')) {
    return "Nice! I've adjusted the spacing.";
  }
  
  // Generic friendly responses
  const genericResponses = [
    "Done! How does that look?",
    "All set! Let me know if you'd like any other adjustments.",
    "Perfect! Made those changes for you.",
  ];
  
  const index = changes.length % genericResponses.length;
  return genericResponses[index];
}

