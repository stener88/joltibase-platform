/**
 * Visual Edits State Management
 * 
 * Manages the state for visual editing mode including selected elements,
 * pending changes, and dirty state tracking.
 */

'use client';

import { useState, useCallback } from 'react';
import { EmailBlock } from '@/lib/email/blocks/types';
import { ElementDescriptor, parseElementId } from '@/lib/email/visual-edits/element-descriptor';
import { applyElementChanges, createDescriptorFromMetadata, deleteElement as deleteElementFn } from '@/lib/email/visual-edits/element-mapper';

export interface PendingChange {
  blockId: string;
  elementId: string;
  changes: Record<string, any>;
}

export interface VisualEditsState {
  isActive: boolean;
  selectedElement: {
    descriptor: ElementDescriptor;
    domElement: HTMLElement;
  } | null;
  pendingChanges: Map<string, PendingChange>;
  isDirty: boolean;
  showExitPrompt: boolean; // Show save/discard prompt when trying to exit with changes
}

export function useVisualEditsState(blocks: EmailBlock[]) {
  const [state, setState] = useState<VisualEditsState>({
    isActive: false,
    selectedElement: null,
    pendingChanges: new Map(),
    isDirty: false,
    showExitPrompt: false,
  });

  // Toggle visual edits mode
  const toggleVisualEdits = useCallback(() => {
    setState(prev => {
      // If trying to exit with pending changes, show the exit prompt instead
      if (prev.isActive && prev.isDirty) {
        return {
          ...prev,
          showExitPrompt: true,
        };
      }
      
      // Otherwise, toggle normally
      return {
        ...prev,
        isActive: !prev.isActive,
        selectedElement: null,
        showExitPrompt: false,
      };
    });
  }, []);

  // Activate visual edits mode
  const activateVisualEdits = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      showExitPrompt: false,
    }));
  }, []);

  // Deactivate visual edits mode (with dirty check)
  const deactivateVisualEdits = useCallback((force: boolean = false) => {
    setState(prev => {
      if (prev.isDirty && !force) {
        // Don't deactivate if there are unsaved changes unless forced
        return prev;
      }
      return {
        ...prev,
        isActive: false,
        selectedElement: null,
        showExitPrompt: false,
      };
    });
  }, []);

  // Select an element
  const selectElement = useCallback((descriptor: ElementDescriptor, domElement: HTMLElement) => {
    setState(prev => ({
      ...prev,
      selectedElement: { descriptor, domElement },
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedElement: null,
    }));
  }, []);

  // Add or update pending changes for an element
  const updatePendingChanges = useCallback((
    blockId: string,
    elementId: string,
    changes: Record<string, any>
  ) => {
    setState(prev => {
      const newPendingChanges = new Map(prev.pendingChanges);
      const key = `${blockId}-${elementId}`;
      
      const existing = newPendingChanges.get(key);
      if (existing) {
        // Merge with existing changes
        newPendingChanges.set(key, {
          ...existing,
          changes: { ...existing.changes, ...changes },
        });
      } else {
        newPendingChanges.set(key, { blockId, elementId, changes });
      }

      return {
        ...prev,
        pendingChanges: newPendingChanges,
        isDirty: true,
      };
    });
  }, []);

  // Get pending changes for a specific element
  const getPendingChanges = useCallback((blockId: string, elementId: string): Record<string, any> | null => {
    const key = `${blockId}-${elementId}`;
    const change = state.pendingChanges.get(key);
    return change ? change.changes : null;
  }, [state.pendingChanges]);

  // Apply all pending changes to blocks
  const applyChanges = useCallback((): EmailBlock[] => {
    let updatedBlocks = [...blocks];
    let hasDeletedBlocks = false;

    state.pendingChanges.forEach((change) => {
      // Check if this is a delete operation
      if (change.changes.__deleted && change.changes.__updatedBlocks) {
        updatedBlocks = change.changes.__updatedBlocks;
        hasDeletedBlocks = true;
        return;
      }

      // Regular element update - reconstruct descriptor from metadata
      const blockIndex = updatedBlocks.findIndex(b => b.id === change.blockId);
      if (blockIndex === -1) return;

      // Parse elementId to get elementType
      const parsed = parseElementId(change.elementId);
      if (!parsed) return;

      const elementType = parsed.contentKey;

      // Recreate descriptor from metadata
      const descriptor = createDescriptorFromMetadata(
        change.elementId,
        elementType,
        change.blockId,
        updatedBlocks
      );

      if (!descriptor) return;

      const block = updatedBlocks[blockIndex];
      const updatedBlock = applyElementChanges(block, descriptor, change.changes);
      updatedBlocks[blockIndex] = updatedBlock;
    });

    // Clear pending changes and dirty state
    setState(prev => ({
      ...prev,
      pendingChanges: new Map(),
      isDirty: false,
      isActive: false, // Exit visual mode after saving
      selectedElement: null,
      showExitPrompt: false,
    }));

    return updatedBlocks;
  }, [blocks, state.pendingChanges, state.selectedElement]);

  // Discard all pending changes
  const discardChanges = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingChanges: new Map(),
      isDirty: false,
      isActive: false, // Exit visual mode after discarding
      selectedElement: null,
      showExitPrompt: false,
    }));
  }, []);

  // Delete element
  const deleteElement = useCallback((descriptor: ElementDescriptor): boolean => {
    // CRITICAL: Use current working blocks (with pending changes applied), not original blocks
    // This ensures multiple sequential deletes work correctly
    const currentWorkingBlocks = getWorkingBlocks(blocks, state.pendingChanges);
    
    const result = deleteElementFn(currentWorkingBlocks, descriptor);
    
    if (!result.success) {
      console.error('Delete failed:', result.error);
      return false;
    }
    
    // Mark as deleted by adding a special pending change
    setState(prev => {
      const newPendingChanges = new Map(prev.pendingChanges);
      const key = `${descriptor.blockId}-${descriptor.elementId}`;
      
      newPendingChanges.set(key, {
        blockId: descriptor.blockId,
        elementId: descriptor.elementId,
        changes: { __deleted: true, __updatedBlocks: result.updatedBlocks },
      });

      return {
        ...prev,
        pendingChanges: newPendingChanges,
        isDirty: true,
      };
    });

    return true;
  }, [blocks, state.pendingChanges]);

  return {
    state,
    toggleVisualEdits,
    activateVisualEdits,
    deactivateVisualEdits,
    selectElement,
    clearSelection,
    updatePendingChanges,
    getPendingChanges,
    applyChanges,
    discardChanges,
    deleteElement,
    getWorkingBlocks,
  };
}

/**
 * Get working blocks with all pending changes applied (for preview)
 * This is what the user sees before saving
 */
export function getWorkingBlocks(blocks: EmailBlock[], pendingChanges: Map<string, PendingChange>): EmailBlock[] {
  if (pendingChanges.size === 0) {
    return blocks;
  }

  let workingBlocks = [...blocks];
  
  pendingChanges.forEach((change) => {
    // Check if this is a delete operation
    if (change.changes.__deleted && change.changes.__updatedBlocks) {
      // Use the pre-computed deleted blocks
      workingBlocks = change.changes.__updatedBlocks;
      return;
    }

    // Apply regular content/style changes
    const blockIndex = workingBlocks.findIndex(b => b.id === change.blockId);
    if (blockIndex === -1) {
      return; // Block not found, skip
    }

    // Parse elementId to get elementType
    const parsed = parseElementId(change.elementId);
    if (!parsed) {
      return; // Invalid elementId, skip
    }

    // The contentKey is typically the elementType for most elements
    const elementType = parsed.contentKey;

    // Recreate descriptor from metadata
    const descriptor = createDescriptorFromMetadata(
      change.elementId,
      elementType,
      change.blockId,
      workingBlocks
    );

    if (!descriptor) {
      return; // Couldn't create descriptor, skip
    }

    // Apply the changes to this block
    workingBlocks[blockIndex] = applyElementChanges(
      workingBlocks[blockIndex],
      descriptor,
      change.changes
    );
  });

  return workingBlocks;
}

