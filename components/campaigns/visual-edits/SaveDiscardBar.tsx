/**
 * Save/Discard Bar
 * 
 * Compact tooltip-style bar that appears when trying to exit visual edits with pending changes.
 */

'use client';

interface SaveDiscardBarProps {
  onSave: () => void;
  onDiscard: () => void;
  changesCount: number;
}

export function SaveDiscardBar({ onSave, onDiscard, changesCount }: SaveDiscardBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[100] py-3 px-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-white">
          <span className="font-medium">{changesCount}</span> {changesCount === 1 ? 'change' : 'changes'} pending
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onDiscard}
            className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#3d3d3d] rounded-lg transition-colors"
          >
            Discard
          </button>
          
          <button
            onClick={onSave}
            className="px-3 py-1.5 text-sm font-medium text-white bg-[#e9a589] rounded-lg hover:bg-[#d89478] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

