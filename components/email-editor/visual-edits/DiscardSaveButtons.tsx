/**
 * Discard/Save Buttons
 * 
 * Floating buttons for discarding or saving changes after exiting visual edit mode
 * Matches FloatingToolbar style but with text labels instead of icons
 */

'use client';

import { X, Check } from 'lucide-react';

interface DiscardSaveButtonsProps {
  position: { x: number; y: number };
  onDiscard: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function DiscardSaveButtons({
  position,
  onDiscard,
  onSave,
  isSaving = false,
  hasChanges = false,
}: DiscardSaveButtonsProps) {
  console.log('[DiscardSaveButtons] Rendering', { position, isSaving, hasChanges });
  
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 px-4 py-3 z-[100]"
    >
      {/* Discard Button with text */}
      <button
        onClick={onDiscard}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 hover:bg-[#4d4d4d] rounded-lg transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
        title="Discard changes"
      >
        <X className="w-4 h-4 text-white" />
        <span className="text-sm text-white font-medium">Discard</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600" />

      {/* Save Button with text */}
      <button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="flex items-center gap-2 px-4 py-2 hover:bg-green-600 rounded-lg transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
        title="Save changes"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white font-medium">Saving...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Save</span>
          </>
        )}
      </button>
    </div>
  );
}

