/**
 * Brand Kit Validation Utilities
 * 
 * Prevents example/placeholder values from being stored in database
 */

/**
 * Common example/placeholder company names that should not be used
 */
const EXAMPLE_COMPANY_NAMES = [
  'taskflow',
  'acme',
  'acme corp',
  'acme inc',
  'my company',
  'your company',
  'example',
  'example inc',
  'example corp',
  'test company',
  'company name',
  '[product name]',
  '[yourcompany]',
  'yourcompany inc',
];

/**
 * Check if a company name is a common example/placeholder
 */
export function isExampleCompanyName(companyName: string): boolean {
  const normalized = companyName.toLowerCase().trim();
  return EXAMPLE_COMPANY_NAMES.includes(normalized);
}

/**
 * Validate company name is real and not an example
 */
export function validateCompanyName(companyName: string): {
  isValid: boolean;
  error?: string;
  suggestion?: string;
} {
  // Check if empty
  if (!companyName || companyName.trim().length === 0) {
    return {
      isValid: false,
      error: 'Company name is required',
    };
  }

  // Check if too short
  if (companyName.trim().length < 2) {
    return {
      isValid: false,
      error: 'Company name must be at least 2 characters',
    };
  }

  // Check if it's an example value
  if (isExampleCompanyName(companyName)) {
    return {
      isValid: false,
      error: 'Please use your actual company name, not a placeholder',
      suggestion: 'Enter your real company name (e.g., "Smith & Associates", "TechStart LLC")',
    };
  }

  // Check for placeholder brackets
  if (companyName.includes('[') || companyName.includes(']')) {
    return {
      isValid: false,
      error: 'Company name contains placeholder syntax',
      suggestion: 'Remove brackets and use your actual company name',
    };
  }

  return { isValid: true };
}

/**
 * Sanitize company name (remove extra spaces, capitalize properly)
 */
export function sanitizeCompanyName(companyName: string): string {
  return companyName
    .trim()
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
}

/**
 * Get a user-friendly error message for validation failures
 */
export function getValidationErrorMessage(validation: ReturnType<typeof validateCompanyName>): string {
  if (validation.isValid) return '';
  
  let message = validation.error || 'Invalid company name';
  if (validation.suggestion) {
    message += `. ${validation.suggestion}`;
  }
  
  return message;
}

/**
 * Check if brand kit contains example data
 */
export function hasExampleData(brandKit: {
  companyName: string;
  primaryColor?: string;
  secondaryColor?: string;
}): {
  hasExamples: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (isExampleCompanyName(brandKit.companyName)) {
    issues.push(`Company name "${brandKit.companyName}" appears to be a placeholder`);
  }

  // Check for default blue colors (might be unintentional)
  if (
    brandKit.primaryColor === '#2563eb' &&
    brandKit.secondaryColor === '#3b82f6'
  ) {
    issues.push('Using default blue color scheme - consider customizing');
  }

  return {
    hasExamples: issues.length > 0,
    issues,
  };
}

