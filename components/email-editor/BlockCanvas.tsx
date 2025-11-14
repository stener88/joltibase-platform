'use client';

import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { renderBlock } from '@/lib/email/blocks/renderer';
import { BlockToolbar } from './BlockToolbar';

type DeviceMode = 'desktop' | 'mobile';

interface BlockCanvasProps {
  blocks: EmailBlock[];
  designConfig: GlobalEmailSettings;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  deviceMode?: DeviceMode;
  onBlockSelect: (id: string | null) => void;
  onBlockHover: (id: string | null) => void;
  onAddBlockClick: (position: number, type: 'above' | 'below') => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
}

export function BlockCanvas({
  blocks,
  designConfig,
  selectedBlockId,
  hoveredBlockId,
  deviceMode = 'desktop',
  onBlockSelect,
  onBlockHover,
  onAddBlockClick,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: BlockCanvasProps) {
  
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  const canvasWidth = deviceMode === 'desktop' ? designConfig.maxWidth : 375;

  return (
    <div className="h-full flex flex-col">
      {/* Disable link navigation in visual editor */}
      <style>{`
        .email-block-content a {
          pointer-events: none !important;
        }
        .email-block-content button {
          pointer-events: none !important;
        }
      `}</style>
      
      {/* Canvas - Using same styling as EmailFrame */}
      <div 
        className="flex-1 overflow-y-auto p-8 bg-[#faf9f5]"
        style={{ backgroundColor: designConfig.backgroundColor || '#faf9f5' }}
        onClick={(e) => {
          // Click on gray background (not on email container or blocks) deselects
          const emailContainer = (e.target as HTMLElement).closest('[data-email-container]');
          if (!emailContainer) {
            onBlockSelect(null);
          }
        }}
      >
        <div
          className="mx-auto transition-all duration-300"
          data-email-container
          style={{
            width: canvasWidth,
            maxWidth: '100%',
            backgroundColor: designConfig.backgroundColor,
          }}
        >
          {/* Email Container */}
          <div
            className="relative"
            style={{
              backgroundColor: designConfig.contentBackgroundColor,
              fontFamily: designConfig.fontFamily,
            }}
          >
            {sortedBlocks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 mb-4">No blocks yet</p>
                <button
                  onClick={() => onAddBlockClick(0, 'above')}
                  className="px-4 py-2 bg-[#e9a589] text-white rounded-lg hover:bg-[#d89478] transition-colors"
                >
                  Add First Block
                </button>
              </div>
            ) : (
              sortedBlocks.map((block, index) => {
                const isSelected = block.id === selectedBlockId;
                const isHovered = block.id === hoveredBlockId;
                const showControls = isSelected || isHovered;

                return (
                  <div
                    key={block.id}
                    className="relative group"
                    onMouseEnter={() => onBlockHover(block.id)}
                    onMouseLeave={() => onBlockHover(null)}
                  >
                    {/* Plus Button Above */}
                    <button
                      className={`absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border-2 border-gray-300 hover:border-[#e9a589] hover:bg-[#e9a589] hover:text-white transition-all duration-200 flex items-center justify-center text-gray-600 shadow-sm hover:shadow-md ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBlockClick(block.position, 'above');
                      }}
                      title="Add block above"
                    >
                      <span className="text-base leading-none">+</span>
                    </button>

                    {/* Block Content */}
                    <div
                      className={`email-block-content relative transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'outline outline-2 outline-[#e9a589] outline-offset-[-2px]'
                          : isHovered
                          ? 'outline outline-2 outline-gray-300 outline-offset-[-2px]'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockSelect(block.id);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: renderBlock(block, { globalSettings: designConfig }),
                      }}
                    />

                    {/* Floating Toolbar */}
                    {isSelected && (
                      <BlockToolbar
                        blockId={block.id}
                        canMoveUp={index > 0}
                        canMoveDown={index < sortedBlocks.length - 1}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                        onDuplicate={onDuplicate}
                        onDelete={onDelete}
                      />
                    )}

                    {/* Plus Button Below */}
                    <button
                      className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border-2 border-gray-300 hover:border-[#e9a589] hover:bg-[#e9a589] hover:text-white transition-all duration-200 flex items-center justify-center text-gray-600 shadow-sm hover:shadow-md ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBlockClick(block.position + 1, 'below');
                      }}
                      title="Add block below"
                    >
                      <span className="text-base leading-none">+</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

