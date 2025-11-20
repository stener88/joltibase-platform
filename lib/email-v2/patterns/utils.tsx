/**
 * Pattern Utilities
 * 
 * Helper functions for email pattern components
 */

/**
 * Simple markdown to HTML parser for email content
 * Handles: **bold**, *italic*, and basic formatting
 */
export function parseMarkdown(text: string): string {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>text</em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Basic line breaks
    .replace(/\n/g, '<br/>');
}

/**
 * Check if URL is a valid image (not placeholder/example)
 */
export function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes('example.com')) return false;
  if (url.includes('[') || url.includes(']')) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Generate placeholder image URL using picsum.photos
 * Uses a seed for consistent images based on the context.
 */
export function getPlaceholderImage(width: number, height: number, seed?: string): string {
  // Use seed if provided for consistent images, otherwise random
  if (seed) {
    // Clean seed to make it URL-safe
    const cleanSeed = seed.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `https://picsum.photos/seed/${cleanSeed}/${width}/${height}`;
  }
  return `https://picsum.photos/${width}/${height}`;
}

/**
 * Render text with markdown support
 * Returns a span with dangerouslySetInnerHTML for React Email compatibility
 */
export function MarkdownText({ children }: { children: string }) {
  return <span dangerouslySetInnerHTML={{ __html: parseMarkdown(children) }} />;
}

