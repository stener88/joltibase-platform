'use client';

import { BLOCK_DEFINITIONS, getAllBlockDefinitions } from '@/lib/email/blocks/registry';
import { BlockType } from '@/lib/email/blocks/types';
import { 
  X, 
  Image, 
  Type, 
  FileText, 
  Square, 
  Minus, 
  Sparkles, 
  BarChart3, 
  MessageSquare, 
  Grid3x3, 
  GitCompare, 
  Share2, 
  FileCode,
  Layers
} from 'lucide-react';

interface BlockPaletteModalProps {
  onSelect: (blockType: BlockType) => void;
  onClose: () => void;
  position: 'above' | 'below';
}

// Icon mapping for block types
const getBlockIcon = (type: BlockType) => {
  const iconProps = { className: "w-5 h-5" };
  switch (type) {
    case 'logo':
      return <Image {...iconProps} />;
    case 'spacer':
      return <Square {...iconProps} />;
    case 'heading':
      return <Type {...iconProps} />;
    case 'text':
      return <FileText {...iconProps} />;
    case 'image':
      return <Image {...iconProps} />;
    case 'button':
      return <Square {...iconProps} />;
    case 'divider':
      return <Minus {...iconProps} />;
    case 'hero':
      return <Sparkles {...iconProps} />;
    case 'stats':
      return <BarChart3 {...iconProps} />;
    case 'testimonial':
      return <MessageSquare {...iconProps} />;
    case 'feature-grid':
      return <Grid3x3 {...iconProps} />;
    case 'comparison':
      return <GitCompare {...iconProps} />;
    case 'social-links':
      return <Share2 {...iconProps} />;
    case 'footer':
      return <FileCode {...iconProps} />;
    default:
      return <Layers {...iconProps} />;
  }
};

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
        className="bg-[#faf9f5] rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-[#e8e7e5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e7e5] bg-white">
          <div>
            <h3 className="text-lg font-semibold text-[#3d3d3a]">Add Block</h3>
            <p className="text-sm text-[#6b6b6b] mt-0.5">
              Select a block to insert {position}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f5f4ed] transition-colors"
          >
            <X className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>

        {/* Block Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {blockDefinitions.map((definition) => (
              <button
                key={definition.type}
                onClick={() => onSelect(definition.type)}
                className="group p-3 border border-[#e8e7e5] rounded-lg hover:border-[#e9a589] hover:bg-white transition-all duration-200 hover:shadow-sm text-left flex flex-col gap-2 bg-white"
              >
                {/* Icon */}
                <div className="text-[#6b6b6b] group-hover:text-[#e9a589] transition-colors">
                  {getBlockIcon(definition.type)}
                </div>

                {/* Name */}
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-[#3d3d3a] leading-tight">
                    {definition.name}
                  </div>
                  <div className="text-[10px] text-[#6b6b6b] line-clamp-2 leading-tight">
                    {definition.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e8e7e5] bg-white">
          <p className="text-xs text-[#6b6b6b] text-center">
            Click any block type to insert it into your email
          </p>
        </div>
      </div>
    </div>
  );
}

