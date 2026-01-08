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

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
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
 * @param viewport - Safe area bounds (absolute coordinates) - typically iframe bounds
 * @returns Optimal position in parent viewport coordinates
 */
export function calculateSmartToolbarPosition(
  iframeRect: IframeRect,
  elementRect: ElementRect,
  toolbar: ToolbarDimensions,
  viewport: ViewportBounds
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

  // Check which positions fit in viewport bounds (semantically correct!)
  const validPositions = candidates.filter(pos => {
    const fitsVertically = 
      pos.top >= viewport.top + VIEWPORT_PADDING &&
      pos.top + toolbar.height <= viewport.bottom - VIEWPORT_PADDING;
    
    const fitsHorizontally = 
      pos.left >= viewport.left + VIEWPORT_PADDING &&
      pos.left + toolbar.width <= viewport.right - VIEWPORT_PADDING;
    
    return fitsVertically && fitsHorizontally;
  });

  // Return first valid position (preference: below > above > right > left)
  if (validPositions.length > 0) {
    return validPositions[0];
  }

  // Fallback: Center in viewport (when element is too large or no valid positions)
  const centerTop = viewport.top + ((viewport.bottom - viewport.top) / 2) - (toolbar.height / 2);
  const centerLeft = viewport.left + ((viewport.right - viewport.left) / 2) - (toolbar.width / 2);
  
  return {
    placement: 'fixed-top-right',
    top: Math.max(viewport.top + VIEWPORT_PADDING, centerTop),
    left: Math.max(viewport.left + VIEWPORT_PADDING, centerLeft),
  };
}

/**
 * Check if element is sufficiently visible in viewport bounds
 */
export function isElementVisible(
  elementRect: ElementRect,
  viewport: ViewportBounds,
  threshold: number = 0.3
): boolean {
  const visibleHeight = Math.min(elementRect.bottom, viewport.bottom) - 
                        Math.max(elementRect.top, viewport.top);
  const visibleWidth = Math.min(elementRect.right, viewport.right) - 
                       Math.max(elementRect.left, viewport.left);
  
  const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
  const totalArea = elementRect.width * elementRect.height;
  
  if (totalArea === 0) return false;
  
  return visibleArea / totalArea >= threshold;
}

