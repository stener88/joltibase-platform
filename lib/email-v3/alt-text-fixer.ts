/**
 * Smart Alt-Text Auto-Fix
 * 
 * Ensures all <Img> components have descriptive alt text.
 * Uses context-aware fallbacks based on filename and attributes.
 */

/**
 * Extract meaningful name from image URL
 */
function filenameToAlt(src: string): string {
  const filename = src.split('/').pop()?.split('?')[0] || 'image';
  
  return filename
    .replace(/^photo-\d+/, 'Photo')  // Handle Unsplash photo IDs
    .replace(/[-_]/g, ' ')           // Replace separators with spaces
    .replace(/\.\w+$/, '')            // Remove file extension
    .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize words
    .trim() || 'Email image';
}

/**
 * Generate context-aware alt text based on attributes and src
 */
function getContextualAlt(attrs: string, src: string): string {
  const combined = (attrs + src).toLowerCase();
  
  // Check for common image types
  if (combined.includes('logo')) return 'Company logo';
  if (combined.includes('hero') || combined.includes('banner')) return 'Hero image';
  if (combined.includes('product')) return 'Product image';
  if (combined.includes('icon')) return 'Icon';
  if (combined.includes('avatar') || combined.includes('profile')) return 'Profile picture';
  if (combined.includes('background')) return 'Background image';
  if (combined.includes('destination')) return 'Destination image';
  if (combined.includes('feature')) return 'Feature image';
  
  // Fallback to filename-based alt text
  return filenameToAlt(src);
}

/**
 * Ensure all <Img> components have alt text
 * 
 * Adds intelligent fallback alt text for any image missing it.
 * Preserves existing alt text (even if empty).
 * 
 * @param code - TSX code to process
 * @returns Code with all images having alt text
 */
export function ensureAltText(code: string): string {
  let fixCount = 0;
  
  const result = code.replace(
    /<Img\s+(?![^>]*\balt=)([^>]*?)(\/?>)/gi,
    (match, attrs, closing) => {
      fixCount++;
      
      // Extract src for context-aware alt generation
      const srcMatch = attrs.match(/src=["']([^"']+)["']/);
      const src = srcMatch?.[1] || '';
      
      // Generate contextual alt text
      const altText = getContextualAlt(attrs, src);
      
      // Always use self-closing tag for consistency
      const cleanAttrs = attrs.trim();
      return `<Img ${cleanAttrs} alt="${altText}" />`;
    }
  );
  
  if (fixCount > 0) {
    console.log(`🔧 [ALT-FIX] Auto-fixed ${fixCount} image(s) missing alt text`);
  }
  
  return result;
}

