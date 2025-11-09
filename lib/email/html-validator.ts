/**
 * HTML Email Validator & Sanitizer
 * 
 * Ensures AI-generated HTML is safe and email-client compatible
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedHtml?: string;
}

/**
 * Dangerous tags that should never appear in emails
 */
const DANGEROUS_TAGS = [
  'script',
  'iframe',
  'object',
  'embed',
  'applet',
  'link', // External stylesheets
  'base',
  'meta', // Except charset
  'form', // Forms in emails are problematic
  'input',
  'button',
  'textarea',
  'select',
];

/**
 * Tags that are generally safe for emails
 */
const SAFE_TAGS = [
  'html',
  'head',
  'body',
  'title',
  'meta', // With restrictions
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'div',
  'span',
  'p',
  'a',
  'img',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'center',
  'font',
];

/**
 * Validate and sanitize HTML for email compatibility
 */
export function validateEmailHtml(html: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check for dangerous tags
  const dangerousTagPattern = new RegExp(
    `<(${DANGEROUS_TAGS.join('|')})[\\s>]`,
    'gi'
  );
  const dangerousMatches = html.match(dangerousTagPattern);
  if (dangerousMatches) {
    errors.push(
      `Contains dangerous tags: ${dangerousMatches.join(', ')}. These have been removed.`
    );
  }

  // 2. Check for <style> tags (should use inline styles)
  if (/<style[^>]*>/i.test(html)) {
    warnings.push(
      'Contains <style> tags. Email clients may strip these. Use inline styles instead.'
    );
  }

  // 3. Check for external resources
  if (/src=["']http(?!s:\/\/)/i.test(html)) {
    warnings.push(
      'Contains non-HTTPS image sources. Some email clients may block these.'
    );
  }

  // 4. Check for JavaScript in attributes
  const jsAttributePattern = /on\w+\s*=\s*["'][^"']*["']/gi;
  const jsMatches = html.match(jsAttributePattern);
  if (jsMatches) {
    errors.push(
      `Contains JavaScript event handlers: ${jsMatches.slice(0, 3).join(', ')}${jsMatches.length > 3 ? '...' : ''}. These have been removed.`
    );
  }

  // 5. Check for CSS that might not work in email clients
  if (/position\s*:\s*(absolute|fixed)/i.test(html)) {
    warnings.push(
      'Contains absolute/fixed positioning. This may not work in all email clients.'
    );
  }

  if (/display\s*:\s*flex/i.test(html)) {
    warnings.push(
      'Contains flexbox CSS. This is not supported in many email clients.'
    );
  }

  // 6. Sanitize the HTML
  let sanitizedHtml = html;

  // Remove dangerous tags
  DANGEROUS_TAGS.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
    sanitizedHtml = sanitizedHtml.replace(regex, '');
    // Self-closing tags
    const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gi');
    sanitizedHtml = sanitizedHtml.replace(selfClosingRegex, '');
  });

  // Remove JavaScript event handlers
  sanitizedHtml = sanitizedHtml.replace(jsAttributePattern, '');

  // Remove javascript: in href
  sanitizedHtml = sanitizedHtml.replace(
    /href\s*=\s*["']javascript:[^"']*["']/gi,
    'href="#"'
  );

  // 7. Basic structure check
  if (!/<table/i.test(sanitizedHtml)) {
    warnings.push(
      'Email does not appear to use table-based layout. This is recommended for email compatibility.'
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    sanitizedHtml: isValid ? sanitizedHtml : undefined,
  };
}

/**
 * Quick check if HTML is safe (no validation details)
 */
export function isEmailHtmlSafe(html: string): boolean {
  const result = validateEmailHtml(html);
  return result.isValid;
}

/**
 * Sanitize HTML without validation (always returns sanitized version)
 */
export function sanitizeEmailHtml(html: string): string {
  const result = validateEmailHtml(html);
  return result.sanitizedHtml || html;
}

/**
 * Email-safe HTML guidelines for AI prompts
 */
export const EMAIL_HTML_GUIDELINES = `
**Email-Safe HTML Rules:**

1. **Layout:**
   - Use TABLE-BASED layouts (not flexbox or grid)
   - Nested tables are OK and recommended
   - Use <td> for content blocks

2. **Styling:**
   - ALL styles must be INLINE (style="...")
   - No <style> tags or external stylesheets
   - No CSS3 features (flex, grid, transforms, etc.)
   - Use web-safe fonts: Arial, Helvetica, Georgia, Times New Roman, Courier, Verdana

3. **Images:**
   - Use absolute URLs (https:// only)
   - Always include alt text
   - Specify width and height attributes

4. **Links:**
   - Use <a href="..."> tags
   - Make entire button areas clickable with table cells

5. **Colors:**
   - Use hex colors (#000000) or named colors
   - Ensure good contrast for accessibility

6. **Forbidden:**
   - NO JavaScript (<script>, onclick, etc.)
   - NO forms (<form>, <input>, <button>)
   - NO iframes or embeds
   - NO external CSS files
   - NO position: absolute/fixed
   - NO flexbox or grid

7. **Best Practices:**
   - Keep width under 600px for desktop
   - Use padding in <td> for spacing
   - Test in multiple email clients
   - Provide plain text alternative
   - Use merge tags: {{firstName}}, {{companyName}}, etc.
`.trim();

