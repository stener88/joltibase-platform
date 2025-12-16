import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { updateComponentText, updateInlineStyle, updateImageSrc } from '@/lib/email-v3/tsx-manipulator';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';

interface OptimisticEdit {
  componentId: string;
  property: string;
  value: string;
  timestamp: number;
}

interface UseVisualEditsOptions {
  tsxCode: string;
  onCommit: (newCode: string, description?: string) => void;
}

/**
 * Hook for managing visual editing with optimistic updates
 * Handles component selection, property changes, and debounced commits
 */
export function useVisualEdits({ tsxCode, onCommit }: UseVisualEditsOptions) {
  const [optimisticEdits, setOptimisticEdits] = useState<OptimisticEdit[]>([]);
  
  // Debounced commit function
  const commitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced commit (500ms)
  const commitEdits = useCallback((newTsx: string, description: string = 'Edit') => {
    if (commitTimeoutRef.current) {
      clearTimeout(commitTimeoutRef.current);
    }
    
    commitTimeoutRef.current = setTimeout(() => {
      console.log('[VISUAL] Committing edit:', description, 'TSX length:', newTsx.length);
      onCommit(newTsx, description);
      setOptimisticEdits([]); // Clear after commit
    }, 500);
  }, [onCommit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
    };
  }, []);

  // Display TSX = committed tsxCode + optimistic edits
  const displayTsx = useMemo(() => {
    if (optimisticEdits.length === 0) {
      return tsxCode;
    }
    
    console.log('[VISUAL] Applying', optimisticEdits.length, 'optimistic edits');
    
    let result = tsxCode;
    for (const edit of optimisticEdits) {
      try {
        const parsed = parseAndInjectIds(result);
        
        if (edit.property === 'text' || edit.property === 'textContent') {
          result = updateComponentText(result, parsed.componentMap, edit.componentId, edit.value);
        } else if (edit.property === 'imageSrc') {
          const { url, alt, width, height } = JSON.parse(edit.value);
          result = updateImageSrc(result, parsed.componentMap, edit.componentId, url, alt, width, height);
        } else if (edit.property === 'imageAlt') {
          result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, edit.value);
        } else if (edit.property === 'imageWidth') {
          const numValue = parseInt(edit.value, 10);
          if (!isNaN(numValue)) {
            result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, undefined, numValue, undefined);
          }
        } else if (edit.property === 'imageHeight') {
          const numValue = parseInt(edit.value, 10);
          if (!isNaN(numValue)) {
            result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, undefined, undefined, numValue);
          }
        } else {
          // Handle spacing and other style properties
          const spacingProps = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
                                'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
          const valueWithUnit = spacingProps.includes(edit.property) ? `${edit.value}px` : edit.value;
          result = updateInlineStyle(result, parsed.componentMap, edit.componentId, edit.property, valueWithUnit);
        }
      } catch (error) {
        console.error('[VISUAL] Failed to apply optimistic edit:', error, edit);
      }
    }
    
    return result;
  }, [tsxCode, optimisticEdits]);

  // Send direct update (optimistic + debounced commit)
  const sendDirectUpdate = useCallback((componentId: string, property: string, value: string) => {
    console.log('[VISUAL] Direct update:', { componentId, property, value });
    
    // 1. Send instant DOM update via postMessage
    const livePreviewUpdate = (window as any).__livePreviewSendDirectUpdate;
    if (livePreviewUpdate) {
      livePreviewUpdate({
        type: 'direct-update',
        componentId,
        property,
        value,
      });
    }
    
    // 2. Add optimistic edit
    const edit: OptimisticEdit = {
      componentId,
      property,
      value,
      timestamp: Date.now(),
    };
    setOptimisticEdits(prev => {
      const filtered = prev.filter(e => 
        !(e.componentId === componentId && e.property === property)
      );
      return [...filtered, edit];
    });
    
    // 3. Commit changes (debounced)
    try {
      const parsed = parseAndInjectIds(tsxCode);
      let newTsx = tsxCode;
      
      if (property === 'text' || property === 'textContent') {
        newTsx = updateComponentText(tsxCode, parsed.componentMap, componentId, value);
      } else if (property === 'imageSrc') {
        const { url, alt, width, height } = JSON.parse(value);
        newTsx = updateImageSrc(tsxCode, parsed.componentMap, componentId, url, alt, width, height);
      } else if (property === 'imageAlt') {
        newTsx = updateImageSrc(tsxCode, parsed.componentMap, componentId, undefined, value);
      } else if (property === 'imageWidth') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          newTsx = updateImageSrc(tsxCode, parsed.componentMap, componentId, undefined, undefined, numValue, undefined);
        }
      } else if (property === 'imageHeight') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          newTsx = updateImageSrc(tsxCode, parsed.componentMap, componentId, undefined, undefined, undefined, numValue);
        }
      } else {
        const spacingProps = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
                              'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
        const valueWithUnit = spacingProps.includes(property) ? `${value}px` : value;
        newTsx = updateInlineStyle(tsxCode, parsed.componentMap, componentId, property, valueWithUnit);
      }
      
      commitEdits(newTsx, `Update ${property}`);
    } catch (error) {
      console.error('[VISUAL] Failed to apply edit:', error);
    }
  }, [tsxCode, commitEdits]);

  return {
    displayTsx,
    optimisticEdits,
    sendDirectUpdate,
  };
}

