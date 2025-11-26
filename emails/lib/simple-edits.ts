/**
 * Simple Edit Detection
 * 
 * Detects simple edits that can be applied directly to source code
 * without requiring AI full-file rewrite.
 */

export interface SimpleEdit {
  type: 'color' | 'text' | 'size';
  property?: string;
  value?: string;
  operation?: 'increase' | 'decrease';
  amount?: number;
}

export interface ComponentContext {
  type: string;
  text: string;
  line?: number;
  selector?: string;
}

/**
 * Parse a user message to detect if it's a simple edit
 * Returns null if the edit is too complex for direct manipulation
 */
export function parseSimpleEdit(message: string): SimpleEdit | null {
  const messageLower = message.toLowerCase().trim();
  
  // Color changes
  const colorEdit = parseColorEdit(messageLower);
  if (colorEdit) return colorEdit;
  
  // Text changes
  const textEdit = parseTextEdit(message);
  if (textEdit) return textEdit;
  
  // Size changes
  const sizeEdit = parseSizeEdit(messageLower);
  if (sizeEdit) return sizeEdit;
  
  // Too complex for simple edit
  return null;
}

/**
 * Detect color changes like "make button red" or "change color to #ff0000"
 */
function parseColorEdit(message: string): SimpleEdit | null {
  const colorPatterns = [
    /make.*?(red|blue|green|yellow|purple|orange|pink|black|white|gray|grey)/i,
    /change.*?color to (red|blue|green|yellow|purple|orange|pink|black|white|gray|grey|#[0-9a-f]{6}|#[0-9a-f]{3})/i,
    /turn.*?(red|blue|green|yellow|purple|orange|pink|black|white|gray|grey)/i,
    /set.*?color to (red|blue|green|yellow|purple|orange|pink|black|white|gray|grey|#[0-9a-f]{6}|#[0-9a-f]{3})/i,
  ];
  
  for (const pattern of colorPatterns) {
    const match = message.match(pattern);
    if (match) {
      const colorName = match[1].toLowerCase();
      const hexColor = colorMap[colorName] || (colorName.startsWith('#') ? colorName : null);
      
      if (hexColor) {
        return {
          type: 'color',
          property: 'backgroundColor',
          value: hexColor,
        };
      }
    }
  }
  
  return null;
}

/**
 * Detect text changes like "change text to 'Sign Up'" or "make it say 'Hello'"
 */
function parseTextEdit(message: string): SimpleEdit | null {
  const textPatterns = [
    /change.*?text to ["'](.*?)["']/i,
    /make.*?say ["'](.*?)["']/i,
    /update.*?to ["'](.*?)["']/i,
    /set.*?text to ["'](.*?)["']/i,
    /change.*?to ["'](.*?)["']/i,
  ];
  
  for (const pattern of textPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return {
        type: 'text',
        value: match[1],
      };
    }
  }
  
  return null;
}

/**
 * Detect size changes like "make bigger" or "make smaller"
 */
function parseSizeEdit(message: string): SimpleEdit | null {
  if (/make.*?bigger|larger|increase.*?size/i.test(message)) {
    return {
      type: 'size',
      property: 'fontSize',
      operation: 'increase',
      amount: 1.2,
    };
  }
  
  if (/make.*?smaller|decrease.*?size/i.test(message)) {
    return {
      type: 'size',
      property: 'fontSize',
      operation: 'decrease',
      amount: 0.8,
    };
  }
  
  return null;
}

/**
 * Color name to hex mapping
 */
const colorMap: Record<string, string> = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#10b981',
  yellow: '#fbbf24',
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899',
  black: '#000000',
  white: '#ffffff',
  gray: '#6b7280',
  grey: '#6b7280',
};





