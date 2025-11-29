/**
 * TSX Code Validator
 * 
 * Validates generated TSX code before applying changes
 * Catches common errors and provides actionable feedback
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate TSX code structure and content
 * 
 * @param code - TSX code to validate
 * @returns Validation result with errors and warnings
 */
export function validateTsxCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic structure checks
  if (!code || code.trim().length === 0) {
    errors.push('Code is empty');
    return { valid: false, errors, warnings };
  }
  
  // Must have export default function
  if (!code.includes('export default function')) {
    errors.push('Missing "export default function" declaration');
  }
  
  // Must import from React Email
  if (!code.includes('@react-email/components')) {
    errors.push('Missing React Email component imports');
  }
  
  // Check for React import (optional but recommended)
  if (!code.includes("import React") && !code.includes("import * as React")) {
    warnings.push('Missing React import - may cause issues in some environments');
  }
  
  // Validate image URLs
  validateImageUrls(code, errors, warnings);
  
  // Check for forbidden patterns
  validateForbiddenPatterns(code, errors, warnings);
  
  // Check for balanced JSX tags
  validateJsxBalance(code, errors, warnings);
  
  // Check for component IDs preservation
  validateComponentIds(code, warnings);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate image URLs in the code
 */
function validateImageUrls(code: string, errors: string[], warnings: string[]): void {
  const imgMatches = code.match(/src\s*=\s*["']([^"']+)["']/g);
  
  if (!imgMatches) return;
  
  imgMatches.forEach((match) => {
    const urlMatch = match.match(/src\s*=\s*["']([^"']+)["']/);
    if (!urlMatch) return;
    
    const url = urlMatch[1];
    
    // Check for empty URLs
    if (!url || url.trim().length === 0) {
      errors.push('Found empty image src attribute');
      return;
    }
    
    // Check for invalid URL format
    if (!isValidImageUrl(url)) {
      warnings.push(`Potentially invalid image URL: ${url.substring(0, 50)}...`);
    }
    
    // Check for localhost URLs (will break in production)
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      errors.push('Found localhost URL - will not work in production');
    }
  });
}

/**
 * Check if URL is valid
 */
function isValidImageUrl(url: string): boolean {
  // Allow data URIs
  if (url.startsWith('data:image/')) return true;
  
  // Validate HTTP(S) URLs
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check for forbidden patterns that cause issues
 */
function validateForbiddenPatterns(code: string, errors: string[], warnings: string[]): void {
  // Dynamic content patterns (props, variables)
  if (code.match(/\{[^}]*props\./)) {
    errors.push('Found dynamic props usage - emails must have static content');
  }
  
  if (code.match(/\{[^}]*\.map\(/)) {
    errors.push('Found .map() usage - write components explicitly instead');
  }
  
  // Forbidden Tailwind classes
  const forbiddenClasses = [
    'space-x-', 'space-y-', 'gap-', 'divide-',
    'hover:', 'focus:', 'active:', 'group-',
    'dark:', 'lg:', 'md:', 'sm:',
  ];
  
  forbiddenClasses.forEach((className) => {
    if (code.includes(className)) {
      warnings.push(`Found potentially problematic Tailwind class: ${className} (may not work in email clients)`);
    }
  });
  
  // Check for console.log (debugging leftover)
  if (code.includes('console.log') || code.includes('console.error')) {
    warnings.push('Found console statements - should be removed for production');
  }
}

/**
 * Check for balanced JSX tags
 */
function validateJsxBalance(code: string, errors: string[], warnings: string[]): void {
  // Basic check for common React Email components
  const components = ['Section', 'Heading', 'Text', 'Button', 'Img', 'Row', 'Column'];
  
  components.forEach((comp) => {
    const openTags = (code.match(new RegExp(`<${comp}[\\s>]`, 'g')) || []).length;
    const closeTags = (code.match(new RegExp(`</${comp}>`, 'g')) || []).length;
    const selfClosing = (code.match(new RegExp(`<${comp}[^>]*/>`, 'g')) || []).length;
    
    // Self-closing tags don't need close tags
    if (openTags - selfClosing !== closeTags) {
      warnings.push(`Potentially unbalanced <${comp}> tags (${openTags} open, ${closeTags} close, ${selfClosing} self-closing)`);
    }
  });
}

/**
 * Check if component IDs are present (for visual editing)
 */
function validateComponentIds(code: string, warnings: string[]): void {
  const hasDataComponentId = code.includes('data-component-id');
  
  if (!hasDataComponentId) {
    warnings.push('No component IDs found - visual editing may not work correctly');
  }
}

/**
 * Quick syntax check - does it look like valid TypeScript?
 */
export function quickSyntaxCheck(code: string): boolean {
  // Very basic checks
  const hasUnbalancedBraces = (code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length;
  const hasUnbalancedParens = (code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length;
  const hasUnbalancedBrackets = (code.match(/\[/g) || []).length !== (code.match(/\]/g) || []).length;
  
  return !hasUnbalancedBraces && !hasUnbalancedParens && !hasUnbalancedBrackets;
}

