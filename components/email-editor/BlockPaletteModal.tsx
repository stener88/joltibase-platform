'use client';

import { BLOCK_DEFINITIONS, getAllBlockDefinitions } from '@/lib/email/blocks/registry';
import { BlockType } from '@/lib/email/blocks/types';
import { X } from 'lucide-react';

interface BlockPaletteModalProps {
  onSelect: (blockType: BlockType) => void;
  onClose: () => void;
  position: 'above' | 'below';
}

export function BlockPaletteModal({
  onSelect,
  onClose,
  position,
}: BlockPaletteModalProps) {
  const blockDefinitions = getAllBlockDefinitions();

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Block</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Select a block to insert {position}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Block Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {blockDefinitions.map((definition) => (
              <button
                key={definition.type}
                onClick={() => onSelect(definition.type)}
                className="group p-4 border-2 border-gray-200 rounded-xl hover:border-[#1a1aff] hover:bg-[#1a1aff]/5 transition-all duration-200 hover:shadow-md text-center flex flex-col items-center gap-3"
              >
                {/* Icon */}
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {definition.icon}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {definition.name}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {definition.description}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {definition.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Click any block type to insert it into your email
          </p>
        </div>
      </div>
    </div>
  );
}

