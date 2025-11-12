import { useReducer, useCallback, useRef, useEffect } from 'react';
import type { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';

interface EditorState {
  blocks: EmailBlock[];
  globalSettings: GlobalEmailSettings;
}

interface HistoryState {
  past: EditorState[];
  present: EditorState | null;
  future: EditorState[];
}

type HistoryAction =
  | { type: 'INIT'; payload: EditorState }
  | { type: 'UPDATE'; payload: EditorState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_FUTURE' };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'INIT':
      return {
        past: [],
        present: action.payload,
        future: [],
      };
      
    case 'UPDATE':
      if (!state.present) return state;
      
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [], // Clear future on new edit
      };
      
    case 'UNDO':
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: state.present ? [state.present, ...state.future] : state.future,
      };
      
    case 'REDO':
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: next,
        future: newFuture,
      };
      
    case 'CLEAR_FUTURE':
      return {
        ...state,
        future: [],
      };
      
    default:
      return state;
  }
}

export function useEditorHistory(onSave: (state: EditorState) => void) {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: null,
    future: [],
  });
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Initialize with campaign data
  const initialize = useCallback((state: EditorState) => {
    dispatch({ type: 'INIT', payload: state });
  }, []);
  
  // Update state and trigger auto-save
  const update = useCallback((state: EditorState) => {
    dispatch({ type: 'UPDATE', payload: state });
    
    // Debounce auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave(state);
    }, 2000);
  }, [onSave]);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    state: history.present,
    initialize,
    update,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

