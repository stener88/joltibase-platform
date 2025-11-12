'use client';

import { ArrowUp, ArrowDown, Copy, Trash2 } from 'lucide-react';

interface BlockToolbarProps {
  blockId: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
}

export function BlockToolbar({
  blockId,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: BlockToolbarProps) {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-20">
      <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp(blockId);
          }}
          disabled={!canMoveUp}
          className={`p-2 rounded transition-colors ${
            canMoveUp
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Move up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown(blockId);
          }}
          disabled={!canMoveDown}
          className={`p-2 rounded transition-colors ${
            canMoveDown
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Move down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <div className="h-px bg-gray-200 my-1" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(blockId);
          }}
          className="p-2 rounded hover:bg-gray-100 text-gray-700 transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(blockId);
          }}
          className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

