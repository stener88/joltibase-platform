import { useState, useCallback } from 'react';
import type { EditMode } from '../EmailEditorV3';

interface UseModeToggleOptions {
  initialMode?: EditMode;
  onModeChange?: (mode: EditMode) => void;
}

/**
 * Hook for managing editor mode (chat ↔ visual)
 * Handles transitions, confirmations, and state snapshots
 */
export function useModeToggle({ initialMode = 'chat', onModeChange }: UseModeToggleOptions = {}) {
  const [mode, setMode] = useState<EditMode>(initialMode);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [visualModeEntryCode, setVisualModeEntryCode] = useState('');
  const [isEnteringVisualMode, setIsEnteringVisualMode] = useState(false);
  const [isExitingVisualMode, setIsExitingVisualMode] = useState(false);

  // Toggle between chat and visual mode
  const toggleMode = useCallback((currentCode: string, hasUnsavedChanges: boolean) => {
    const newMode = mode === 'chat' ? 'visual' : 'chat';
    console.log('[MODE] Toggling from', mode, 'to', newMode);
    
    // Check if there are visual edits
    const hasVisualModeChanges = mode === 'visual' && visualModeEntryCode && currentCode !== visualModeEntryCode;
    
    // If exiting visual mode with changes, show confirmation
    if (mode === 'visual' && (hasVisualModeChanges || hasUnsavedChanges)) {
      console.log('[MODE] Unsaved changes detected:', { hasVisualModeChanges, hasUnsavedChanges });
      setShowExitConfirm(true);
      return;
    }
    
    // Entering visual mode - snapshot current code
    if (newMode === 'visual') {
      setVisualModeEntryCode(currentCode);
      setIsEnteringVisualMode(true);
      setTimeout(() => setIsEnteringVisualMode(false), 600);
    }
    
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
    
    // Clear visual mode state when going back to chat
    if (newMode === 'chat') {
      setVisualModeEntryCode('');
    }
  }, [mode, visualModeEntryCode, onModeChange]);

  // Confirm exit from visual mode (discard changes)
  const confirmExit = useCallback(() => {
    setIsExitingVisualMode(true);
    setShowExitConfirm(false);
    setMode('chat');
    setVisualModeEntryCode('');
    
    setTimeout(() => setIsExitingVisualMode(false), 600);
    
    if (onModeChange) {
      onModeChange('chat');
    }
  }, [onModeChange]);

  // Cancel exit confirmation
  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  return {
    mode,
    setMode,
    showExitConfirm,
    isEnteringVisualMode,
    isExitingVisualMode,
    toggleMode,
    confirmExit,
    cancelExit,
  };
}

