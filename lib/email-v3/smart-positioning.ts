/**
 * Smart Toolbar Positioning
 * 
 * Calculates optimal position for floating toolbar with proper coordinate transformation
 * from iframe space to parent viewport space.
 */

export interface ElementRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export interface IframeRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export interface ToolbarDimensions {
  width: number;
  height: number;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export type Placement = 'below' | 'above' | 'right' | 'left' | 'fixed-top-right';

export interface ToolbarPosition {
  placement: Placement;
  top: number;
  left: number;
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const TOOLBAR_MARGIN = 8;
const VIEWPORT_PADDING = 16;

/**
 * Calculate optimal toolbar position with coordinate transformation
 * 
 * Transforms element coordinates from iframe space to parent viewport space,
 * then intelligently positions toolbar to avoid viewport boundaries.
 * 
 * @param iframeRect - Position of iframe in parent viewport (from getBoundingClientRect)
 * @param elementRect - Position of element in iframe viewport (from iframe's getBoundingClientRect)
 * @param toolbar - Dimensions of toolbar
 * @param viewport - Parent viewport dimensions
 * @returns Optimal position in parent viewport coordinates
 */
export function calculateSmartToolbarPosition(
  iframeRect: IframeRect,
  elementRect: ElementRect,
  toolbar: ToolbarDimensions,
  viewport: ViewportDimensions
): ToolbarPosition {
  
  // Transform element coordinates from iframe space to parent viewport space
  const elementInParentSpace = {
    top: iframeRect.top + elementRect.top,
    left: iframeRect.left + elementRect.left,
    bottom: iframeRect.top + elementRect.bottom,
    right: iframeRect.left + elementRect.right,
    width: elementRect.width,
    height: elementRect.height,
  };
  
  // Generate candidate positions (preference order)
  const candidates: ToolbarPosition[] = [
    // Below (preferred)
    {
      placement: 'below',
      top: elementInParentSpace.bottom + TOOLBAR_MARGIN,
      left: elementInParentSpace.left + (elementInParentSpace.width / 2) - (toolbar.width / 2),
      arrowPosition: 'top',
    },
    // Above
    {
      placement: 'above',
      top: elementInParentSpace.top - toolbar.height - TOOLBAR_MARGIN,
      left: elementInParentSpace.left + (elementInParentSpace.width / 2) - (toolbar.width / 2),
      arrowPosition: 'bottom',
    },
    // Right
    {
      placement: 'right',
      top: elementInParentSpace.top + (elementInParentSpace.height / 2) - (toolbar.height / 2),
      left: elementInParentSpace.right + TOOLBAR_MARGIN,
      arrowPosition: 'left',
    },
    // Left
    {
      placement: 'left',
      top: elementInParentSpace.top + (elementInParentSpace.height / 2) - (toolbar.height / 2),
      left: elementInParentSpace.left - toolbar.width - TOOLBAR_MARGIN,
      arrowPosition: 'right',
    },
  ];

  // Check which positions fit in viewport
  const validPositions = candidates.filter(pos => {
    const fitsVertically = 
      pos.top >= VIEWPORT_PADDING &&
      pos.top + toolbar.height <= viewport.height - VIEWPORT_PADDING;
    
    const fitsHorizontally = 
      pos.left >= VIEWPORT_PADDING &&
      pos.left + toolbar.width <= viewport.width - VIEWPORT_PADDING;
    
    return fitsVertically && fitsHorizontally;
  });

  // Return first valid position (preference: below > above > right > left)
  if (validPositions.length > 0) {
    return validPositions[0];
  }

  // Fallback: Fixed position in top-right corner (when element is too large)
  console.log('[SMART-POSITION] No valid positions, using fixed fallback');
  return {
    placement: 'fixed-top-right',
    top: VIEWPORT_PADDING,
    left: viewport.width - toolbar.width - VIEWPORT_PADDING,
  };
}

/**
 * Check if element is sufficiently visible in viewport
 */
export function isElementVisible(
  elementRect: ElementRect,
  viewport: ViewportDimensions,
  threshold: number = 0.3
): boolean {
  const visibleHeight = Math.min(elementRect.bottom, viewport.height) - 
                        Math.max(elementRect.top, 0);
  const visibleWidth = Math.min(elementRect.right, viewport.width) - 
                       Math.max(elementRect.left, 0);
  
  const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
  const totalArea = elementRect.width * elementRect.height;
  
  if (totalArea === 0) return false;
  
  return visibleArea / totalArea >= threshold;
}

