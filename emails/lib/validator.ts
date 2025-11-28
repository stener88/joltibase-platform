/**
 * Code Validation for Generated TSX Files
 * 
 * Validates that AI-generated code:
 * - Has all required imports
 * - Contains a default export
 * - Is a valid React component
 * - Has no placeholders or TODOs
 * - Has balanced braces/parentheses
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate generated React Email TSX code
 */
export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check minimum length
  if (code.length < 500) {
    errors.push('Code too short (likely incomplete or truncated)');
  }
  
  // Check for required imports
  if (!code.includes('from \'@react-email/components\'')) {
    errors.push('Missing @react-email/components import');
  }
  
  // Check for default export
  if (!code.includes('export default')) {
    errors.push('Missing default export');
  }
  
  // Check for function component
  const hasFunctionComponent = 
    code.match(/export default function \w+/) ||
    code.match(/const \w+ = \([^)]*\) =>/);
  
  if (!hasFunctionComponent) {
    errors.push('Not a valid function component');
  }
  
  // Check for JSX return
  if (!code.includes('return (') && !code.includes('return <')) {
    errors.push('No JSX return statement found');
  }
  
  // Check for Html wrapper (required for React Email)
  if (!code.includes('<Html>')) {
    errors.push('Missing <Html> wrapper (required for React Email)');
  }
  
  // Check for Tailwind wrapper (recommended for styling)
  if (!code.includes('<Tailwind') && !code.includes('Tailwind')) {
    warnings.push('Missing <Tailwind> wrapper - consider using Tailwind for styling');
  }
  
  // Check for balanced braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces (${openBraces} open, ${closeBraces} close)`);
  }
  
  // Check for balanced parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses (${openParens} open, ${closeParens} close)`);
  }
  
  // Check for balanced angle brackets in JSX
  const openTags = (code.match(/</g) || []).length;
  const closeTags = (code.match(/>/g) || []).length;
  if (Math.abs(openTags - closeTags) > 5) { // Allow some tolerance for type annotations
    warnings.push(`Potentially mismatched JSX tags (${openTags} <, ${closeTags} >)`);
  }
  
  // Check for placeholders
  const placeholders = detectPlaceholders(code);
  if (placeholders.length > 0) {
    errors.push(`Contains placeholders: ${placeholders.join(', ')}`);
  }
  
  // Check for duplicate variable declarations
  const duplicateVars = detectDuplicateDeclarations(code);
  if (duplicateVars.length > 0) {
    errors.push(`Duplicate variable declarations: ${duplicateVars.join(', ')}`);
  }
  
  // **CRITICAL**: Check for dynamic content patterns (not editable in visual editor)
  if (code.includes('.map(')) {
    errors.push('Code contains .map() loops - use static content instead. Write out each section individually.');
  }
  
  // Check for JSX expressions in content (makes text non-editable)
  // Pattern to detect {variable} in JSX content (excluding attributes)
  const dynamicJSXContentPattern = />[\s\n]*\{[a-zA-Z_][a-zA-Z0-9_.]*\}[\s\n]*</g;
  if (dynamicJSXContentPattern.test(code)) {
    errors.push('Code contains dynamic JSX expressions like {variable} in content - write static text instead.');
  }
  
  // Check for pseudo-class selectors in className (hover:, focus:, etc.)
  const pseudoClassPattern = /className="[^"]*(?:hover|focus|active|dark|group-):/;
  if (pseudoClassPattern.test(code)) {
    errors.push('Code contains pseudo-class selectors (hover:, focus:, etc.) - these cannot be inlined in emails. Use static classes only.');
  }
  
  // Check for problematic Tailwind utility classes that cannot be inlined
  const problematicClasses = [
    { pattern: /className="[^"]*\bspace-[xy]-\d+/, class: 'space-x-* or space-y-*', fix: 'use inline style={{marginBottom: "16px"}} or style={{gap: "12px"}}' },
    { pattern: /className="[^"]*\bgap-\d+/, class: 'gap-*', fix: 'use inline style={{display: "flex", gap: "12px"}}' },
    { pattern: /className="[^"]*\bdivide-[xy]/, class: 'divide-x or divide-y', fix: 'use individual <Hr /> components or borders' },
    { pattern: /className="[^"]*\bgrid-cols-/, class: 'grid-cols-*', fix: 'use <Row> and <Column> components or inline styles' },
  ];
  
  for (const { pattern, class: className, fix } of problematicClasses) {
    if (pattern.test(code)) {
      errors.push(`Code contains ${className} classes - these cannot be inlined in emails. ${fix} instead.`);
    }
  }
  
  // Check for common React Email components
  const hasComponents = [
    '<Body',
    '<Container',
    '<Section',
    '<Text',
    '<Heading',
  ].some(comp => code.includes(comp));
  
  if (!hasComponents) {
    warnings.push('No React Email components detected (Body, Container, etc.)');
  }
  
  // Check for styling (inline styles or Tailwind classes)
  const hasInlineStyles = code.includes('style=');
  const hasTailwindClasses = code.includes('className=');
  
  if (!hasInlineStyles && !hasTailwindClasses) {
    warnings.push('No styling found (use className for Tailwind or style for inline)');
  }
  
  // Check for TypeScript interface
  if (!code.includes('interface ') && !code.includes('type ')) {
    warnings.push('No TypeScript interface or type definition found');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detect duplicate variable/const declarations
 * This catches cases where AI generates the same variable twice
 */
function detectDuplicateDeclarations(code: string): string[] {
  const duplicates: string[] = [];
  const declarations = new Map<string, number>();
  
  // Match const/let/var declarations (various patterns)
  // Pattern 1: const name = ... or const name: type = ...
  const pattern1 = /(?:const|let|var)\s+(\w+)(?:\s*:\s*\w+)?\s*=/g;
  let match;
  
  while ((match = pattern1.exec(code)) !== null) {
    const varName = match[1];
    const count = declarations.get(varName) || 0;
    declarations.set(varName, count + 1);
  }
  
  // Pattern 2: destructuring - const { name } = ...
  const destructPattern = /(?:const|let|var)\s*\{\s*([^}]+)\s*\}/g;
  while ((match = destructPattern.exec(code)) !== null) {
    const destructVars = match[1].split(',').map(v => v.trim().split(':')[0].trim());
    destructVars.forEach(varName => {
      if (varName && /^\w+$/.test(varName)) {
        const count = declarations.get(varName) || 0;
        declarations.set(varName, count + 1);
      }
    });
  }
  
  // Pattern 3: multiple declarations - const a = 1, b = 2;
  const multiPattern = /(?:const|let|var)\s+\w+[^;]*,\s*(\w+)\s*=/g;
  while ((match = multiPattern.exec(code)) !== null) {
    const varName = match[1];
    const count = declarations.get(varName) || 0;
    declarations.set(varName, count + 1);
  }
  
  // Also check for function declarations
  const funcPattern = /(?:^|\s)function\s+(\w+)\s*\(/gm;
  while ((match = funcPattern.exec(code)) !== null) {
    const funcName = match[1];
    const count = declarations.get(funcName) || 0;
    declarations.set(funcName, count + 1);
  }
  
  // Find duplicates
  declarations.forEach((count, name) => {
    if (count > 1) {
      duplicates.push(name);
    }
  });
  
  return duplicates;
}

/**
 * Detect placeholder comments and incomplete code
 */
export function detectPlaceholders(code: string): string[] {
  const patterns = [
    // Comment placeholders
    /\/\/\s*\.\.\..*$/gm,
    /\/\/\s*rest of.*$/gmi,
    /\/\/\s*TODO.*$/gmi,
    /\/\/\s*FIXME.*$/gmi,
    /\/\/\s*add.*here.*$/gmi,
    /\/\/\s*implement.*$/gmi,
    
    // Block comment placeholders
    /\/\*\s*\.\.\.\s*\*\//g,
    /\/\*\s*rest\s*\*\//gi,
    /\/\*\s*TODO\s*\*\//gi,
    
    // Code placeholders
    /{\s*\/\*\s*\.\.\.\s*\*\/\s*}/g,
    /\.\.\.\w+Props/g,
    
    // Generic ellipsis
    /\.\.\./g,
  ];
  
  const found: string[] = [];
  
  patterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (!found.includes(match.trim())) {
          found.push(match.trim());
        }
      });
    }
  });
  
  // Filter out valid spread operators (e.g., ...props)
  return found.filter(item => {
    // Allow spread operators in valid contexts
    if (item === '...' && code.includes('...props')) {
      return false;
    }
    // Ellipsis in strings is OK
    if (code.includes(`"${item}"`) || code.includes(`'${item}'`)) {
      return false;
    }
    return true;
  });
}

/**
 * Extract code from markdown code blocks
 */
export function extractCodeFromMarkdown(text: string): string {
  // Try to extract from tsx/typescript code block
  const tsxMatch = text.match(/```(?:tsx|typescript)\n([\s\S]*?)\n```/);
  if (tsxMatch) {
    return tsxMatch[1].trim();
  }
  
  // Try any code block
  const codeMatch = text.match(/```\w*\n([\s\S]*?)\n```/);
  if (codeMatch) {
    return codeMatch[1].trim();
  }
  
  // If no code block, assume entire text is code
  return text.trim();
}

/**
 * Clean up common AI output issues
 */
export function cleanGeneratedCode(code: string): string {
  let cleaned = code;
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // Remove line numbers if present (e.g., "1  import React")
  cleaned = cleaned.replace(/^\s*\d+\s+/gm, '');
  
  // Fix common quote issues
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");
  
  // Remove any BOM or invisible characters
  cleaned = cleaned.replace(/^\uFEFF/, '');
  
  // Clean up double spaces
  cleaned = cleaned.replace(/className="\s+/g, 'className="');
  cleaned = cleaned.replace(/\s+"/g, '"');
  
  return cleaned;
}





