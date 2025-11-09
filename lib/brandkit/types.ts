/**
 * Brand Kit Types
 * Used for storing and applying brand identity to AI-generated campaigns
 */

export type FontStyle = 'modern' | 'classic' | 'playful';

export interface BrandKit {
  id: string;
  userId: string;
  companyName: string;
  primaryColor: string;    // Hex color: #2563eb
  secondaryColor: string;  // Hex color: #f59e0b
  accentColor?: string;    // Optional hex color
  fontStyle: FontStyle;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrandKitInput {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontStyle?: FontStyle;
}

export interface UpdateBrandKitInput {
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontStyle?: FontStyle;
}

/**
 * Font style characteristics for email templates
 */
export const FONT_STYLES = {
  modern: {
    label: 'Modern',
    description: 'Clean, sans-serif fonts (Inter, SF Pro)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
  },
  classic: {
    label: 'Classic',
    description: 'Serif fonts (Georgia, Times)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  playful: {
    label: 'Playful',
    description: 'Rounded, friendly fonts',
    fontFamily: "'Nunito', 'Rounded', 'Comic Sans MS', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
} as const;

/**
 * Default color palettes for quick setup
 */
export const DEFAULT_COLOR_PALETTES = {
  blue: {
    name: 'Professional Blue',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
  },
  purple: {
    name: 'Creative Purple',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    accentColor: '#ec4899',
  },
  green: {
    name: 'Growth Green',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    accentColor: '#fbbf24',
  },
  orange: {
    name: 'Energetic Orange',
    primaryColor: '#f97316',
    secondaryColor: '#fb923c',
    accentColor: '#eab308',
  },
  slate: {
    name: 'Minimalist Slate',
    primaryColor: '#475569',
    secondaryColor: '#64748b',
    accentColor: '#0ea5e9',
  },
  red: {
    name: 'Bold Red',
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
    accentColor: '#fbbf24',
  },
} as const;

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * (percent / 100)));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * (percent / 100)));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * (percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.round(rgb.r * (1 - percent / 100)));
  const g = Math.max(0, Math.round(rgb.g * (1 - percent / 100)));
  const b = Math.max(0, Math.round(rgb.b * (1 - percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generate gradient CSS from two colors
 */
export function generateGradient(
  from: string,
  to: string,
  direction: 'to-right' | 'to-bottom' | 'to-br' = 'to-br'
): string {
  const directions = {
    'to-right': '90deg',
    'to-bottom': '180deg',
    'to-br': '135deg', // bottom-right
  };

  return `linear-gradient(${directions[direction]}, ${from}, ${to})`;
}

/**
 * Check if color is light or dark (for text contrast)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrasting text color (black or white)
 */
export function getContrastTextColor(backgroundColor: string): '#000000' | '#ffffff' {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}