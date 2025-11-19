/**
 * Selection Overlay
 * 
 * Provides visual feedback for hovering and selecting elements in visual edits mode.
 */

'use client';

import { useEffect, useState, useMemo } from 'react';

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface SelectionOverlayProps {
  selectedElementId: string | null;
  onElementClick: (element: HTMLElement) => void;
}

export function SelectionOverlay({ selectedElementId, onElementClick }: SelectionOverlayProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<HTMLElement | null>(null);

  // Debounced mouseover handler (50ms delay for smoother performance)
  const debouncedHandleMouseOver = useMemo(
    () => debounce((e: Event) => {
      const target = e.target as HTMLElement;
      
      // Find the closest element with data-element-id
      const element = target.closest('[data-element-id]') as HTMLElement;
      if (element) {
        setHoveredElement(element);
        setHoveredBlock(null); // Clear block hover when hovering element
      } else {
        // If no element, check if hovering over a block wrapper
        const blockWrapper = target.closest('[data-block-wrapper]') as HTMLElement;
        if (blockWrapper) {
          setHoveredBlock(blockWrapper);
          setHoveredElement(null);
        }
      }
    }, 50),
    []
  );

  useEffect(() => {

    const handleMouseOut = (e: Event) => {
      setHoveredElement(null);
      setHoveredBlock(null);
    };

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // First, try to find a specific element
      const element = target.closest('[data-element-id]') as HTMLElement;
      
      if (element) {
        e.preventDefault();
        e.stopPropagation();
        onElementClick(element);
        return;
      }
      
      // If no specific element, check if clicking on a block wrapper
      const blockWrapper = target.closest('[data-block-wrapper]') as HTMLElement;
      if (blockWrapper) {
        e.preventDefault();
        e.stopPropagation();
        // Create a pseudo-element for block-level selection
        const blockId = blockWrapper.getAttribute('data-block-id');
        const blockType = blockWrapper.getAttribute('data-block-type');
        if (blockId && blockType) {
          // Create a temporary element with block selection data
          const pseudoElement = document.createElement('div');
          pseudoElement.setAttribute('data-element-id', `${blockId}-block`); // Format: {blockId}-{elementType}
          pseudoElement.setAttribute('data-element-type', 'block');
          pseudoElement.setAttribute('data-block-id', blockId);
          onElementClick(pseudoElement as HTMLElement);
        }
      }
    };

    // Add event listeners to the email frame
    const emailFrame = document.querySelector('[data-email-frame]');
    if (emailFrame) {
      emailFrame.addEventListener('mouseover', debouncedHandleMouseOver);
      emailFrame.addEventListener('mouseout', handleMouseOut);
      emailFrame.addEventListener('click', handleClick);
    }

    return () => {
      if (emailFrame) {
        emailFrame.removeEventListener('mouseover', debouncedHandleMouseOver);
        emailFrame.removeEventListener('mouseout', handleMouseOut);
        emailFrame.removeEventListener('click', handleClick);
      }
    };
  }, [onElementClick, debouncedHandleMouseOver]);

  // Add hover and selection styles via CSS
  useEffect(() => {
    if (!hoveredElement && !hoveredBlock && !selectedElementId) return;

    const style = document.createElement('style');
    style.id = 'visual-edits-overlay-styles';
    
    let css = '';
    
    // Hover styles for elements
    if (hoveredElement) {
      const elementId = hoveredElement.getAttribute('data-element-id');
      css += `
        [data-element-id="${elementId}"] {
          outline: 2px dashed #e9a589 !important;
          outline-offset: -2px !important;
          cursor: pointer !important;
        }
      `;
    }
    
    // Hover styles for blocks
    if (hoveredBlock) {
      const blockId = hoveredBlock.getAttribute('data-block-id');
      css += `
        [data-block-id="${blockId}"][data-block-wrapper] {
          outline: 2px dashed #e9a589 !important;
          outline-offset: -2px !important;
          cursor: pointer !important;
        }
      `;
    }
    
    // Selection styles
    if (selectedElementId) {
      css += `
        [data-element-id="${selectedElementId}"] {
          outline: 2px solid #e9a589 !important;
          outline-offset: -2px !important;
          box-shadow: 0 0 0 4px rgba(233, 165, 137, 0.1) !important;
        }
        [data-block-id="${selectedElementId}"][data-block-wrapper] {
          outline: 2px solid #e9a589 !important;
          outline-offset: -2px !important;
          box-shadow: 0 0 0 4px rgba(233, 165, 137, 0.1) !important;
        }
      `;
    }
    
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('visual-edits-overlay-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [hoveredElement, hoveredBlock, selectedElementId]);

  return null; // This component only adds event listeners and styles
}

