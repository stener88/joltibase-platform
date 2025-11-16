/**
 * Block Update Hooks
 * 
 * Shared hooks for block settings components to eliminate duplicate update logic.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { EmailBlock } from '@/lib/email/blocks/types';

/**
 * Hook for managing block content updates
 * 
 * @example
 * ```tsx
 * const updateContent = useBlockContentUpdates(block, onUpdate);
 * updateContent({ text: 'New text' });
 * ```
 */
export function useBlockContentUpdates<T extends EmailBlock>(
  block: T,
  onUpdate: (blockId: string, updates: Partial<T>) => void
) {
  // Use ref to avoid recreating callback when content changes
  const blockRef = useRef(block);
  useEffect(() => {
    blockRef.current = block;
  }, [block]);
  
  return useCallback(
    (updates: Partial<T['content']>) => {
      onUpdate(blockRef.current.id, {
        content: { ...blockRef.current.content, ...updates },
      } as Partial<T>);
    },
    [onUpdate]
  );
}

/**
 * Hook for managing block settings updates
 * 
 * @example
 * ```tsx
 * const updateSettings = useBlockSettingsUpdates(block, onUpdate);
 * updateSettings({ color: '#ff0000' });
 * ```
 */
export function useBlockSettingsUpdates<T extends EmailBlock>(
  block: T,
  onUpdate: (blockId: string, updates: Partial<T>) => void
) {
  // Use ref to avoid recreating callback when settings change
  const blockRef = useRef(block);
  useEffect(() => {
    blockRef.current = block;
  }, [block]);
  
  return useCallback(
    (updates: Partial<T['settings']>) => {
      onUpdate(blockRef.current.id, {
        settings: { ...blockRef.current.settings, ...updates },
      } as Partial<T>);
    },
    [onUpdate]
  );
}

/**
 * Hook for managing collapsible sections state
 * 
 * @example
 * ```tsx
 * const { openSections, toggleSection, isOpen } = useCollapsibleSections(['content']);
 * 
 * <CollapsibleSection 
 *   title="Content"
 *   isOpen={isOpen('content')}
 *   onToggle={() => toggleSection('content')}
 * />
 * ```
 */
export function useCollapsibleSections(defaultOpen: string[] = []) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(defaultOpen)
  );

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const isOpen = useCallback(
    (section: string) => openSections.has(section),
    [openSections]
  );

  return {
    openSections,
    toggleSection,
    isOpen,
  };
}

