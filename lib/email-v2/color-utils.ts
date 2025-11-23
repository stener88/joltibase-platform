/**
 * Color Utilities
 * 
 * Ensures accessible, safe color combinations for email generation
 * Prevents "outrageous" combinations while respecting user preferences
 */

/**
 * Calculate relative luminance for WCAG contrast ratio
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsContrastStandard(textColor: string, bgColor: string): boolean {
  return getContrastRatio(textColor, bgColor) >= 4.5;
}

/**
 * Check if color is "too bright" (might hurt eyes on dark mode)
 */
export function isTooVibrant(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  
  // Check if all channels are near max (too bright)
  const avg = (rgb.r + rgb.g + rgb.b) / 3;
  return avg > 230; // Very bright colors
}

/**
 * Check if color is "too dark" for text
 */
export function isTooDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  
  const avg = (rgb.r + rgb.g + rgb.b) / 3;
  return avg < 50; // Very dark colors
}

/**
 * Get safe text color for a given background
 * Returns either black or white based on contrast
 */
export function getSafeTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  // Use white text on dark backgrounds, black on light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Get safe headline color with fallback
 * 
 * @param userColor - User's requested color (optional)
 * @param backgroundColor - Background color to check contrast against
 * @param defaultColor - Default safe color
 * @returns Safe color that meets contrast standards
 */
export function getSafeHeadlineColor(
  userColor: string | undefined,
  backgroundColor: string,
  defaultColor: string
): string {
  // No user preference? Use default
  if (!userColor) return defaultColor;
  
  // Check if user color meets contrast standards
  if (meetsContrastStandard(userColor, backgroundColor)) {
    return userColor;
  }
  
  // User color fails contrast - warn and use default
  console.warn(
    `[ColorSafety] User color ${userColor} on ${backgroundColor} fails WCAG contrast (${getContrastRatio(userColor, backgroundColor).toFixed(2)}:1). Using default ${defaultColor}.`
  );
  return defaultColor;
}

/**
 * Get safe body text color with fallback
 * More lenient than headlines (allows grays)
 */
export function getSafeBodyColor(
  userColor: string | undefined,
  backgroundColor: string,
  defaultColor: string
): string {
  // No user preference? Use default
  if (!userColor) return defaultColor;
  
  // Too vibrant? Don't use for body text
  if (isTooVibrant(userColor)) {
    console.warn(`[ColorSafety] User color ${userColor} too vibrant for body text. Using default ${defaultColor}.`);
    return defaultColor;
  }
  
  // Check contrast
  if (meetsContrastStandard(userColor, backgroundColor)) {
    return userColor;
  }
  
  // Fails contrast - use default
  console.warn(
    `[ColorSafety] User color ${userColor} on ${backgroundColor} fails WCAG contrast (${getContrastRatio(userColor, backgroundColor).toFixed(2)}:1). Using default ${defaultColor}.`
  );
  return defaultColor;
}

/**
 * Validate and sanitize a hex color
 * Returns the color if valid, undefined otherwise
 */
export function validateHexColor(color: string | undefined): string | undefined {
  if (!color) return undefined;
  
  // Check if it's a valid hex color
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    console.warn(`[ColorSafety] Invalid hex color: ${color}`);
    return undefined;
  }
  
  return color;
}

/**
 * Get default colors based on context
 * Smart defaults that work well in most situations
 */
export const DEFAULT_COLORS = {
  // Hero section (on colored background)
  heroHeadline: '#ffffff',
  heroSubheadline: '#e9d5ff', // Light purple tint
  
  // Content sections (on white background)
  contentHeadline: '#111827', // Nearly black
  contentBody: '#374151',     // Dark gray
  contentSubtext: '#6b7280',  // Medium gray
  
  // Footer
  footerText: '#6b7280',      // Medium gray
  footerSubtext: '#9ca3af',   // Light gray
  
  // Backgrounds
  white: '#ffffff',
  lightGray: '#f9fafb',
  
  // CTA/Buttons use primaryColor from settings
} as const;

