/**
 * Multi-layer Email Validation
 * 
 * Validates generated email TSX code across multiple dimensions:
 * 1. Syntax - Basic code structure, imports, exports
 * 2. Email Structure - Html/Body wrappers, inline styles, width constraints
 * 3. Accessibility - Alt text, font sizes, semantic HTML, contrast
 * 4. Best Practices - CTA count, placeholder text, readability
 */

export interface ValidationIssue {
  severity: 'error' | 'warning';
  type: 'syntax' | 'structure' | 'accessibility' | 'best-practice';
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
}

/**
 * Get maximum CTAs allowed for a specific design system
 * Different email types have different CTA norms
 */
function getMaxCTAsForDesignSystem(designSystemId?: string): number {
  if (!designSystemId) return 3; // Default fallback
  
  const limits: Record<string, number> = {
    'newsletter-editorial': 8,      // Newsletters have multiple article links
    'ecommerce-conversion': 10,     // Product grids can have 8+ items
    'travel-booking': 19,           // Travel has nav, destinations, app, footer links
    'saas-product': 3,              // Try it + Learn more + secondary
    'event-conference': 3,          // RSVP + View details + secondary
    'modern-startup': 4,            // Bold action-oriented with features
    'corporate-professional': 3,    // Conservative but allows sections
    'minimal-elegant': 2,           // Minimal, focused (primary + secondary)
  };
  
  return limits[designSystemId] || 3;
}

/**
 * Comprehensive email validation
 */
export function validateEmail(tsxCode: string, designSystemId?: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  
  // 1. Syntax validation
  issues.push(...validateSyntax(tsxCode));
  
  // 2. Email-specific structure validation
  issues.push(...validateEmailStructure(tsxCode));
  
  // 3. Accessibility validation
  issues.push(...validateAccessibility(tsxCode));
  
  // 4. Best practices validation (context-aware based on design system)
  issues.push(...validateBestPractices(tsxCode, designSystemId));
  
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  return {
    isValid: errorCount === 0,
    issues,
    errorCount,
    warningCount
  };
}

/**
 * Layer 1: Syntax Validation
 */
function validateSyntax(code: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for default export
  if (!code.includes('export default')) {
    issues.push({
      severity: 'error',
      type: 'syntax',
      message: 'Missing default export',
      suggestion: 'Add "export default function EmailComponent() {...}"'
    });
  }
  
  // Check for React Email component imports
  const componentRegex = /<(Html|Head|Body|Container|Section|Row|Column|Heading|Text|Button|Link|Img|Hr|Preview|Font|Tailwind)[\s>]/g;
  const usedComponents = new Set<string>();
  let match;
  
  while ((match = componentRegex.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }
  
  // Check each used component is imported
  // Handle both single-line and multi-line imports
  const importSection = code.match(/import\s+\{[\s\S]+?\}\s+from\s+['"]@react-email\/components['"]/);
  const importedComponents = importSection 
    ? importSection[0].match(/\w+/g)?.filter(w => w !== 'import' && w !== 'from' && w !== 'react' && w !== 'email' && w !== 'components') || []
    : [];
  
  usedComponents.forEach(component => {
    if (!importedComponents.includes(component)) {
      issues.push({
        severity: 'error',
        type: 'syntax',
        message: `Component <${component}> is used but not imported`,
        suggestion: `Add ${component} to your @react-email/components import statement`
      });
    }
  });
  
  // Check for unclosed JSX tags (basic check)
  const openTags = (code.match(/<[A-Z][a-zA-Z]*[\s>]/g) || []).length;
  const closeTags = (code.match(/<\/[A-Z][a-zA-Z]*>/g) || []).length;
  const selfClosing = (code.match(/\/>/g) || []).length;
  
  if (openTags !== closeTags + selfClosing) {
    issues.push({
      severity: 'error',
      type: 'syntax',
      message: 'Possible unclosed JSX tags detected',
      suggestion: 'Ensure all JSX tags are properly closed'
    });
  }
  
  return issues;
}

/**
 * Layer 2: Email Structure Validation
 */
function validateEmailStructure(code: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Must have Html wrapper (for full emails, not fragments)
  // Note: V3 patterns are fragments, so skip this for now
  // This will be important for final rendered emails
  
  // Check for className usage (emails require inline styles)
  const classNameMatches = code.match(/className=["'][^"']+["']/g);
  if (classNameMatches && classNameMatches.length > 0) {
    issues.push({
      severity: 'error',
      type: 'structure',
      message: `Found ${classNameMatches.length} className usage(s) - email clients require inline styles`,
      suggestion: 'Replace all className props with inline style objects'
    });
  }
  
  // Check for external CSS (not allowed in emails)
  if (code.includes('<style>') || code.includes('<link') || code.includes('.css')) {
    issues.push({
      severity: 'error',
      type: 'structure',
      message: 'External stylesheets or <style> tags detected',
      suggestion: 'Use inline styles only for email compatibility'
    });
  }
  
  // Check for width constraints (important for email rendering)
  const hasMaxWidth = code.includes('maxWidth') || code.includes('max-width');
  const hasContainer = code.includes('<Container');
  
  if (!hasMaxWidth && !hasContainer) {
    issues.push({
      severity: 'warning',
      type: 'structure',
      message: 'No width constraint found',
      suggestion: 'Use maxWidth: "600px" on a container for proper email rendering'
    });
  }
  
  // Check for CSS Grid or Flexbox (limited email client support)
  if (code.includes('display: "grid"') || code.includes('display: "flex"')) {
    issues.push({
      severity: 'warning',
      type: 'structure',
      message: 'CSS Grid/Flexbox detected - limited support in Outlook',
      suggestion: 'Consider using <Row>/<Column> components for better compatibility'
    });
  }
  
  return issues;
}

/**
 * Layer 3: Accessibility Validation
 */
function validateAccessibility(code: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check all images have alt text
  const imgMatches = code.match(/<Img[^>]*>/g) || [];
  
  imgMatches.forEach((img, index) => {
    if (!img.includes('alt=')) {
      issues.push({
        severity: 'error',
        type: 'accessibility',
        message: `Image ${index + 1} missing alt text`,
        suggestion: 'Add descriptive alt text: alt="Description of what the image shows"'
      });
    }
    
    // Check for empty alt text (only acceptable for decorative images)
    if (img.includes('alt=""') || img.includes("alt=''")) {
      issues.push({
        severity: 'warning',
        type: 'accessibility',
        message: `Image ${index + 1} has empty alt text`,
        suggestion: 'Provide meaningful description or confirm image is purely decorative'
      });
    }
  });
  
  // Check for minimum font sizes
  const fontSizeMatches = code.match(/fontSize:\s*["']?(\d+)(?:px)?["']?/g) || [];
  
  fontSizeMatches.forEach(match => {
    const sizeMatch = match.match(/(\d+)/);
    if (sizeMatch) {
      const size = parseInt(sizeMatch[1]);
      if (size < 12) {
        issues.push({
          severity: 'warning',
          type: 'accessibility',
          message: `Font size ${size}px is too small (minimum 12px recommended)`,
          suggestion: 'Increase to at least 12px for readability (14px+ for body text)'
        });
      }
    }
  });
  
  // Check for semantic HTML usage
  const hasSemanticComponents = 
    code.includes('<Heading') || 
    code.includes('<Text') || 
    code.includes('<Section');
  
  if (!hasSemanticComponents && code.includes('<div')) {
    issues.push({
      severity: 'warning',
      type: 'accessibility',
      message: 'Using <div> without semantic components',
      suggestion: 'Use <Heading>, <Text>, <Section> for better accessibility and structure'
    });
  }
  
  // Check for button/link touch targets
  const buttonMatches = code.match(/<Button[^>]*style=\{[^}]*\}/g) || [];
  
  buttonMatches.forEach((button, index) => {
    const paddingMatch = button.match(/padding:\s*["']([^"']+)["']/);
    if (paddingMatch) {
      const padding = paddingMatch[1];
      // Extract vertical padding (first value in "17px 24px" format)
      const verticalMatch = padding.match(/^(\d+)px/);
      if (verticalMatch) {
        const verticalPadding = parseInt(verticalMatch[1]);
        if (verticalPadding < 12) {
          issues.push({
            severity: 'warning',
            type: 'accessibility',
            message: `Button ${index + 1} may have insufficient touch target size (${verticalPadding}px vertical padding)`,
            suggestion: 'Use minimum 12-14px vertical padding for easier interaction'
          });
        }
      }
    }
  });
  
  return issues;
}

/**
 * Layer 4: Best Practices Validation
 */
function validateBestPractices(code: string, designSystemId?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Count CTAs (Call-to-Actions)
  const buttonCount = (code.match(/<Button/g) || []).length;
  const linkCount = (code.match(/<Link[^>]*href=/g) || []).length;
  const ctaCount = buttonCount + linkCount;
  
  // Get context-aware CTA limit based on design system
  const maxCTAs = getMaxCTAsForDesignSystem(designSystemId);
  
  if (ctaCount > maxCTAs) {
    const systemName = designSystemId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'this email type';
    issues.push({
      severity: 'warning',
      type: 'best-practice',
      message: `Found ${ctaCount} CTAs - too many for ${systemName} (max: ${maxCTAs})`,
      suggestion: `Limit to ${maxCTAs} primary CTA${maxCTAs > 1 ? 's' : ''} for better conversion`
    });
  }
  
  if (ctaCount === 0) {
    issues.push({
      severity: 'warning',
      type: 'best-practice',
      message: 'No call-to-action found',
      suggestion: 'Add a clear CTA button or link to drive user action'
    });
  }
  
  // Check for placeholder text (but NOT JSX double-brace syntax)
  const placeholders = [
    '[Your', '[TODO', '[PLACEHOLDER', 'TODO:', 'FIXME:',
    'Lorem ipsum', 'dolor sit amet', 'consectetur adipiscing',
  ];
  
  placeholders.forEach(placeholder => {
    if (code.includes(placeholder)) {
      issues.push({
        severity: 'error',
        type: 'best-practice',
        message: `Contains placeholder text: "${placeholder}"`,
        suggestion: 'Replace all placeholder text with actual content'
      });
    }
  });
  
  // Check for template variable syntax ({{ variable }}) but not JSX style objects
  // JSX style objects: style={{ ... }} are valid
  // Template variables: {{ name }} or {{{ html }}} are not
  const templateVariablePattern = /\{\{\s*\w+\s*\}\}/;
  const triplebracePattern = /\{\{\{.*?\}\}\}/;
  
  if (templateVariablePattern.test(code) || triplebracePattern.test(code)) {
    issues.push({
      severity: 'error',
      type: 'best-practice',
      message: 'Contains template variable syntax (e.g., {{ variable }})',
      suggestion: 'Replace template variables with static content'
    });
  }
  
  // Check for undefined/null in JSX
  if (code.includes('{undefined}') || code.includes('{null}')) {
    issues.push({
      severity: 'error',
      type: 'best-practice',
      message: 'Found undefined or null in JSX output',
      suggestion: 'Use default values or conditional rendering'
    });
  }
  
  // Check for very long text blocks (readability)
  const textMatches = code.match(/<Text[^>]*>([^<]{500,})<\/Text>/g);
  if (textMatches && textMatches.length > 0) {
    issues.push({
      severity: 'warning',
      type: 'best-practice',
      message: `Found ${textMatches.length} very long text block(s)`,
      suggestion: 'Break up long paragraphs into smaller chunks (2-4 sentences max)'
    });
  }
  
  // Check for missing preview text
  if (!code.includes('<Preview')) {
    issues.push({
      severity: 'warning',
      type: 'best-practice',
      message: 'No preview text found',
      suggestion: 'Add <Preview> component for better inbox display'
    });
  }
  
  // Check for vague CTA text
  const vagueCtaText = ['Click Here', 'Click here', 'Learn More', 'Read More'];
  vagueCtaText.forEach(vague => {
    if (code.includes(`>${vague}<`)) {
      issues.push({
        severity: 'warning',
        type: 'best-practice',
        message: `Vague CTA text: "${vague}"`,
        suggestion: 'Use specific, action-oriented text (e.g., "View Report", "Start Trial")'
      });
    }
  });
  
  return issues;
}

/**
 * Generate auto-fix prompt for AI to correct issues
 */
export function generateFixPrompt(issues: ValidationIssue[]): string {
  if (issues.length === 0) return '';
  
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  
  let prompt = '\n\n## VALIDATION ISSUES TO FIX\n\n';
  
  if (errors.length > 0) {
    prompt += '### CRITICAL ERRORS (Must Fix):\n';
    errors.forEach((issue, i) => {
      prompt += `${i + 1}. **${issue.type}**: ${issue.message}\n`;
      if (issue.suggestion) {
        prompt += `   → ${issue.suggestion}\n`;
      }
    });
    prompt += '\n';
  }
  
  if (warnings.length > 0) {
    prompt += '### WARNINGS (Should Fix):\n';
    warnings.forEach((issue, i) => {
      prompt += `${i + 1}. **${issue.type}**: ${issue.message}\n`;
      if (issue.suggestion) {
        prompt += `   → ${issue.suggestion}\n`;
      }
    });
  }
  
  prompt += `
### CRITICAL RULES TO FOLLOW:
- ALL <Img> tags MUST have descriptive alt text (10-15 words)
- Use ONLY inline styles (no className, no external CSS)
- Import ALL components used from @react-email/components
- Replace ANY placeholder text with actual content
- Minimum font size: 14px for all text
- Use semantic components: <Heading>, <Text>, <Section>
- Follow design system specifications for CTA count
`;
  
  return prompt;
}

/**
 * Get validation summary for logging
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    return result.warningCount > 0 
      ? `✅ Valid (${result.warningCount} warnings)`
      : '✅ Valid (no issues)';
  }
  
  return `❌ Invalid (${result.errorCount} errors, ${result.warningCount} warnings)`;
}

