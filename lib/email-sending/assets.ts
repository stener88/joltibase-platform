/**
 * Asset URL Helper for Email Images
 * Handles dev vs production URLs for email assets
 */

/**
 * Get absolute URL for email assets
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise defaults to localhost
 */
export function getAssetUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get social icon URL (PNG format for email compatibility)
 * Icons should be in /public/email-assets/icons/
 */
export function getSocialIconUrl(platform: string): string {
  return getAssetUrl(`/email-assets/icons/${platform}.png`);
}

/**
 * Get logo URL from brand settings or default
 */
export function getLogoUrl(logoPath?: string): string {
  if (logoPath) {
    return logoPath; // Already absolute URL from upload
  }
  return getAssetUrl('/email-assets/logo.png'); // Fallback
}
