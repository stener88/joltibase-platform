/**
 * Design Tokens for Joltibase Platform
 * 
 * Color Palette inspired by Claude's light theme:
 * - Warm neutrals with sophisticated hierarchy
 * - Coral/peach accents for action elements
 * - High readability with proper contrast
 */

export const colors = {
  // Primary action colors
  primary: '#141413',        // Near-black for primary buttons
  primaryForeground: '#ffffff',
  
  // Accent colors
  accent: '#e9a589',         // Coral/peach for highlights and actions
  accentForeground: '#ffffff',
  
  // Background colors
  background: '#faf9f5',     // Dashboard main background - very light warm beige
  sidebar: '#f5f4ed',        // Sidebar/header background - warm off-white
  card: '#ffffff',           // Card backgrounds
  
  // Text colors
  foreground: '#3d3d3a',     // Primary text - near-black warm gray
  foregroundSecondary: '#6b6b6b', // Secondary text - medium gray
  
  // UI element colors
  border: '#e8e7e5',         // Subtle warm gray borders
  
  // Neutral colors
  black: '#000000',
  white: '#ffffff',
  
  // Warm gray scale (replacing old grays)
  gray50: '#faf9f5',         // Lightest - dashboard bg
  gray100: '#f5f4ed',        // Sidebar/header bg
  gray200: '#e8e7e5',        // Borders
  gray300: '#d4d3cf',        // Disabled states
  gray400: '#a8a7a3',        // Placeholder text
  gray500: '#6b6b6b',        // Secondary text
  gray600: '#3d3d3a',        // Primary text
  gray700: '#2d2d2a',        // Headings
  gray800: '#1d1d1a',        // High emphasis
  gray900: '#141413',        // Buttons, darkest elements
} as const;

export const spacing = {
  xs: '8px',    // 1x8px
  sm: '16px',   // 2x8px
  md: '24px',   // 3x8px
  lg: '32px',   // 4x8px
  xl: '40px',   // 5x8px
  '2xl': '48px', // 6x8px
} as const;

export const typography = {
  fontFamily: {
    sans: '"DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

