/**
 * JSON Sanitization Utilities
 * 
 * Handles edge cases where AI returns JSON wrapped in markdown code blocks
 */

/**
 * Sanitize AI response by removing markdown code fences
 * 
 * @param content - Raw AI response content
 * @returns Cleaned JSON string
 * 
 * @example
 * sanitizeAIResponse('```json\n{"key": "value"}\n```')
 * // Returns: '{"key": "value"}'
 */
export function sanitizeAIResponse(content: string): string {
  let cleaned = content.trim();
  
  // Remove markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  return cleaned.trim();
}







