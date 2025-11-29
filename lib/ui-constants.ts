/**
 * UI Constants - Z-Index System
 * 
 * Centralized z-index scale for consistent layering across the application.
 * Use semantic names for better code readability and maintenance.
 */

export const Z_INDEX = {
  // Base layers
  BASE: 0,
  DROPDOWN: 10,
  STICKY_HEADER: 20,
  
  // Editor-specific
  VISUAL_EDITOR_TOOLBAR: 40,
  VISUAL_EDITOR_LOADING: 50,
  
  // Global overlays
  MODAL_BACKDROP: 60,
  MODAL_CONTENT: 70,
  TOOLTIP: 80,
  TOAST_NOTIFICATION: 90,
} as const;

// Type safety
export type ZIndex = typeof Z_INDEX[keyof typeof Z_INDEX];

