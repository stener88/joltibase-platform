/**
 * Hook for managing React Email V2 editor state
 */

import { useState, useCallback } from 'react';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import {
  findComponentById,
  updateComponentById,
  deleteComponentById,
  moveComponent,
  duplicateComponent,
} from '@/lib/email-v2';

export interface V2EditorState {
  rootComponent: EmailComponent;
  globalSettings: GlobalEmailSettings;
  selectedComponentId: string | null;
  history: EmailComponent[];
  historyIndex: number;
  isDirty: boolean;
}

export function useV2Editor(
  initialRoot: EmailComponent,
  initialSettings: GlobalEmailSettings
) {
  const [state, setState] = useState<V2EditorState>({
    rootComponent: initialRoot,
    globalSettings: initialSettings,
    selectedComponentId: null,
    history: [initialRoot],
    historyIndex: 0,
    isDirty: false,
  });

  // Select a component
  const selectComponent = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedComponentId: id,
    }));
  }, []);

  // Get currently selected component
  const getSelectedComponent = useCallback((): EmailComponent | null => {
    if (!state.selectedComponentId) return null;
    return findComponentById(state.rootComponent, state.selectedComponentId);
  }, [state.rootComponent, state.selectedComponentId]);

  // Add to history
  const addToHistory = useCallback((newRoot: EmailComponent) => {
    setState((prev) => {
      // Remove any history after current index
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      // Add new state
      newHistory.push(newRoot);
      
      // Limit history to 50 items
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        ...prev,
        rootComponent: newRoot,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      };
    });
  }, []);

  // Update component
  const updateComponent = useCallback(
    (id: string, updates: Partial<EmailComponent>) => {
      const newRoot = updateComponentById(state.rootComponent, id, updates);
      addToHistory(newRoot);
    },
    [state.rootComponent, addToHistory]
  );

  // Delete component
  const deleteComponent = useCallback(
    (id: string) => {
      const newRoot = deleteComponentById(state.rootComponent, id);
      if (newRoot) {
        addToHistory(newRoot);
        // Deselect if deleted component was selected
        if (state.selectedComponentId === id) {
          selectComponent(null);
        }
      }
    },
    [state.rootComponent, state.selectedComponentId, addToHistory, selectComponent]
  );

  // Move component up/down
  const moveComponentUpDown = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const newRoot = moveComponent(state.rootComponent, id, direction);
      addToHistory(newRoot);
    },
    [state.rootComponent, addToHistory]
  );

  // Duplicate component
  const duplicateComponentById = useCallback(
    (id: string) => {
      const newRoot = duplicateComponent(state.rootComponent, id);
      addToHistory(newRoot);
    },
    [state.rootComponent, addToHistory]
  );

  // Update global settings
  const updateGlobalSettings = useCallback(
    (updates: Partial<GlobalEmailSettings>) => {
      setState((prev) => ({
        ...prev,
        globalSettings: {
          ...prev.globalSettings,
          ...updates,
        },
        isDirty: true,
      }));
    },
    []
  );

  // Update entire root component (for AI refinements)
  const setRootComponent = useCallback(
    (newRoot: EmailComponent) => {
      addToHistory(newRoot);
    },
    [addToHistory]
  );

  // Undo
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          rootComponent: prev.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return prev;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          rootComponent: prev.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return prev;
    });
  }, []);

  // Reset dirty flag
  const markAsSaved = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDirty: false,
    }));
  }, []);

  return {
    // State
    rootComponent: state.rootComponent,
    globalSettings: state.globalSettings,
    selectedComponentId: state.selectedComponentId,
    isDirty: state.isDirty,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,

    // Actions
    selectComponent,
    getSelectedComponent,
    updateComponent,
    deleteComponent,
    moveComponent: moveComponentUpDown,
    duplicateComponent: duplicateComponentById,
    updateGlobalSettings,
    setRootComponent,
    undo,
    redo,
    markAsSaved,
  };
}

