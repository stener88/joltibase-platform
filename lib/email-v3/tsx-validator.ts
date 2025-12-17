/**
 * TSX Structure Validator
 * 
 * Validates TSX structure for common errors like mixing HTML tables with React Email components
 */

export interface TSXValidationResult {
  valid: boolean;
  errors: TSXValidationError[];
}

export interface TSXValidationError {
  type: 'structure' | 'nesting' | 'syntax';
  message: string;
  sectionId?: string;
  lineNumber?: number;
  suggestion?: string;
}

/**
 * Validate TSX structure for common errors
 */
export function validateTSXStructure(tsx: string): TSXValidationResult {
  const errors: TSXValidationError[] = [];

  // Extract sections with their IDs
  const sections = extractSections(tsx);

  sections.forEach(section => {
    // Check for mixing HTML tables with React Email components
    const hasTables = /<table|<tr|<td|<th/i.test(section.content);
    const hasReactEmailComponents = /<(Row|Column|Section)\s/i.test(section.content);

    if (hasTables && hasReactEmailComponents) {
      // Check if Row/Column is nested inside table tags
      const tableContent = extractTableContent(section.content);
      if (tableContent) {
        const hasNestedReactComponents = /<(Row|Column)\s/.test(tableContent);
        if (hasNestedReactComponents) {
          errors.push({
            type: 'nesting',
            message: 'Cannot nest React Email <Row>/<Column> components inside HTML <table>/<td> tags',
            sectionId: section.id,
            suggestion: 'Use ONLY HTML table tags OR ONLY React Email components, not both mixed'
          });
        }
      }
    }

    // Check for unclosed tags
    const openTags = (section.content.match(/<(\w+)(?:\s|>)/g) || []).length;
    const closeTags = (section.content.match(/<\/(\w+)>/g) || []).length;
    if (openTags > closeTags + 5) { // Allow some self-closing tags
      errors.push({
        type: 'structure',
        message: 'Potential unclosed tags detected',
        sectionId: section.id,
        suggestion: 'Check that all opening tags have corresponding closing tags'
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Extract sections from TSX with their IDs
 */
function extractSections(tsx: string): Array<{ id: string; content: string }> {
  const sections: Array<{ id: string; content: string }> = [];
  
  // Match section comments like {/* Section: footer-1 */} or {/* footer-1: footer-full-company-info */}
  const sectionRegex = /\{\/\*\s*(?:Section:\s*)?([a-zA-Z0-9\-]+)(?::.*?)?\s*\*\/\}([\s\S]*?)(?=\{\/\*\s*(?:Section:\s*)?[a-zA-Z0-9\-]+|<\/Container>|$)/g;
  
  let match;
  while ((match = sectionRegex.exec(tsx)) !== null) {
    sections.push({
      id: match[1],
      content: match[2]
    });
  }

  return sections;
}

/**
 * Extract content inside <table> tags
 */
function extractTableContent(content: string): string | null {
  const tableMatch = content.match(/<table[\s\S]*?<\/table>/i);
  return tableMatch ? tableMatch[0] : null;
}

/**
 * Get detailed error message with suggestions
 */
export function getErrorDetails(error: TSXValidationError): string {
  let message = `[${error.type.toUpperCase()}] ${error.message}`;
  
  if (error.sectionId) {
    message += `\n  Section: ${error.sectionId}`;
  }
  
  if (error.lineNumber) {
    message += `\n  Line: ${error.lineNumber}`;
  }
  
  if (error.suggestion) {
    message += `\n  Suggestion: ${error.suggestion}`;
  }
  
  return message;
}


